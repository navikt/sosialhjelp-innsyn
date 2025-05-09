"use client";
import * as React from "react";
import { BodyLong, Heading } from "@navikt/ds-react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { logger } from "@navikt/next-logger";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import Banner from "../banner/Banner";
import { UthevetPanel } from "../paneler/UthevetPanel";
import { ApplicationSpinner } from "../applicationSpinner/ApplicationSpinner";
import EllaBlunk from "../ellaBlunk";
import { TilgangResponse } from "../../generated/model";

const StyledElla = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    margin-top: 2rem;
`;
export interface TilgangskontrollsideProps {
    children: React.ReactNode;
    harTilgang?: TilgangResponse;
}

const sessionUrl = process.env.NEXT_PUBLIC_LOGIN_BASE_URL + "/oauth2/session";
const loginUrl = process.env.NEXT_PUBLIC_LOGIN_BASE_URL + "/oauth2/login";

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
    const pathname = usePathname();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchDekoratorSession()
            .then((result) => {
                if (result.status === 401 || result.data?.session.active === false) {
                    return router.replace(loginUrl + "?redirect=" + window.location.href);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [router]);

    if (isLoading) {
        return (
            <div className="informasjon-side">
                {pathname.includes("/utbetaling") && <Banner>{t("app.tittel")}</Banner>}
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
            <div className="informasjon-side">
                <Banner>{t("app.tittel")}</Banner>
                <Wrapper className="blokk-center">
                    <UthevetPanel className="panel-glippe-over">
                        <StyledElla>
                            <EllaBlunk size="175" />
                        </StyledElla>
                        <Heading as="p" size="large" spacing>
                            {t("tilgang.header", {
                                fornavn,
                            })}
                        </Heading>
                        <BodyLong spacing>{t("tilgang.info")}</BodyLong>
                    </UthevetPanel>
                </Wrapper>
            </div>
        );
    }

    return <>{children}</>;
};

export default Tilgangskontrollside;
