"use client";

import * as React from "react";
import { Bleed, BodyLong, Box, Heading, Show, Stack, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { logger } from "@navikt/next-logger";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ApplicationSpinner } from "../applicationSpinner/ApplicationSpinner";
import EllaBlunk from "../ellaBlunk";
import { TilgangResponse } from "@generated/model";
import { browserEnv } from "@config/env";
import { getSessionMetadata } from "@generated/session-metadata-controller/session-metadata-controller";
import OkonomiskSosialhjelpIcon from "@components/ikoner/OkonomiskSosialhjelp";

export interface TilgangskontrollsideProps {
    children: React.ReactNode;
    harTilgang?: TilgangResponse;
}

const sessionUrl = process.env.NEXT_PUBLIC_LOGIN_BASE_URL + "/oauth2/session";
const loginUrl = process.env.NEXT_PUBLIC_LOGIN_BASE_URL + "/oauth2/login";
const dekoratorApiInfoUrl = browserEnv.NEXT_PUBLIC_DEKORATOR_API_BASE_URL + "/auth";
const logoutUrl = browserEnv.NEXT_PUBLIC_INNSYN_ORIGIN + process.env.NEXT_PUBLIC_DEKORATOREN_LOGOUT_URL;
const fetchDekoratorAuth = async () => {
    try {
        const response = await fetch(dekoratorApiInfoUrl, { method: "get", credentials: "include" });
        if (response.status === 401) {
            return { status: 401 };
        }
        if (response.ok) {
            const data: { userId: string } = await response.json();
            return { data, status: response.status };
        }
        return { status: response.status };
    } catch (e: unknown) {
        return { error: e };
    }
};

const fetchDekoratorSession = async () => {
    const response = await fetch(sessionUrl, {
        method: "get",
        credentials: "include",
    });
    try {
        if (response.status === 401) {
            return { status: 401 };
        }
        if (response.ok) {
            const data: { session: { active: boolean } } = await response.json();
            return { data, status: response.status };
        }
        return { status: response.status };
    } catch (e: unknown) {
        return { error: e };
    }
};

const Tilgangskontrollside = ({ children, harTilgang }: TilgangskontrollsideProps) => {
    const router = useRouter();
    const t = useTranslations("Tilgangskontrollside");
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        if (!["local", "mock", "e2e"].includes(browserEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsLoading(true);
            fetchDekoratorSession()
                .then((result) => {
                    if (result.status === 401 || result.data?.session.active === false) {
                        return window.location.replace(loginUrl + "?redirect=" + window.location.href);
                    }
                    Promise.all([fetchDekoratorAuth(), getSessionMetadata()])
                        .then(([decoratorSession, innsynSession]) => {
                            if (decoratorSession.data?.userId !== innsynSession.personId) {
                                if (decoratorSession.error) {
                                    logger.warn(
                                        `Fikk feil under innhenting av dekorator-session. Error: ${decoratorSession.error}`
                                    );
                                }
                                logger.warn(
                                    `Dekorator userId does not match innsyn session personId. ${!decoratorSession.data?.userId ? "No userId from dekorator session" : ""}`
                                );
                                return window.location.replace(logoutUrl);
                            }
                        })
                        .catch((e) => {
                            logger.warn(`Fikk feil under innhenting av dekorator- eller innsynsession. Error: ${e}`);
                        });
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="mb-16">
                <ApplicationSpinner />
            </div>
        );
    }

    if (harTilgang?.harTilgang === false) {
        const fornavn = harTilgang?.fornavn;
        if (!fornavn || fornavn === "") {
            logger.warn(`Viser tilgangskontrollside uten fornavn`);
        } else {
            logger.warn(`Viser tilgangskontrollside med fornavn`);
        }

        return (
            <VStack gap={{ xs: "space-48", md: "space-80" }} className="mt-6 ax-md:mt-20">
                <Bleed marginInline={{ lg: "space-24" }} asChild>
                    <Stack
                        gap="space-16"
                        direction={{ sm: "row-reverse", lg: "row" }}
                        justify={{ sm: "space-between", lg: "start" }}
                        wrap={false}
                    >
                        <Show above="sm">
                            <OkonomiskSosialhjelpIcon className="mr-4" aria-hidden />
                        </Show>
                        <Heading size="xlarge" level="1">
                            {t("tittel")}
                        </Heading>
                    </Stack>
                </Bleed>
                <div className="flex items-center justify-center">
                    <EllaBlunk size="175" />
                </div>
                <Box>
                    <Heading as="h2" size="large" spacing>
                        {t("header", {
                            fornavn,
                        })}
                    </Heading>
                    <BodyLong>{t("info")}</BodyLong>
                </Box>
            </VStack>
        );
    }

    return <>{children}</>;
};

export default Tilgangskontrollside;
