import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import React from "react";
import { randomUUID } from "node:crypto";
import { isKlageTilgjengelig } from "../../../_utils/isKlageTilgjengelig";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import { hentSakForVedtak } from "@generated/ssr/sak-controller/sak-controller";

import KlageForm from "./_components/KlageForm";
import { hentKlageForVedtak } from "@generated/ssr";
import { logger } from "@navikt/next-logger";
import { AuthenticatedFetchError } from "@api/ssr/authenticatedFetch";

const Page = async ({ params }: { params: Promise<{ id: string; vedtakId: string }> }) => {
    const { id: fiksDigisosId, vedtakId } = await params;
    if (!(await isKlageTilgjengelig(fiksDigisosId))) {
        redirect(`/soknad/${fiksDigisosId}`);
    }
    try {
        const klage = await hentKlageForVedtak(fiksDigisosId, vedtakId);
        redirect(`/klage/${fiksDigisosId}/${klage.klageId}`);
    } catch (e: unknown) {
        if (e instanceof AuthenticatedFetchError && e.status === 404) {
            // noop. Finnes ingen klager fra før
        } else {
            logger.error(e, "Feil ved henting av klage for vedtak.");
            redirect(`/soknad/${fiksDigisosId}`);
        }
    }

    const t = await getTranslations("OpprettKlagePage");
    const tCrumbs = await getTranslations("StatusPage.breadcrumbs");

    const sak = await hentSakForVedtak(fiksDigisosId, vedtakId);
    return (
        <>
            <ClientBreadcrumbs
                dynamicBreadcrumbs={[
                    { title: tCrumbs("soknader"), url: "/sosialhjelp/innsyn/soknader" },
                    { title: tCrumbs("soknad"), url: `/sosialhjelp/innsyn/soknad/${fiksDigisosId}` },
                    { title: tCrumbs("klageskjema") },
                ]}
            />
            <VStack gap={{ xs: "space-40", md: "space-64" }}>
                <Heading size="xlarge" level="1">
                    {t("tittel")}
                </Heading>
                <KlageForm
                    fiksDigisosId={fiksDigisosId}
                    vedtakId={vedtakId}
                    klageId={randomUUID()}
                    vedtaksbrev={sak.vedtaksBrev}
                    vedtakMottatt={sak.vedtaksdato}
                    soknadSendt={sak.soknadSendtDato}
                    navKontor={sak.navEnhetNavn}
                />
            </VStack>
        </>
    );
};

export const generateMetadata = async () => {
    const t = await getTranslations("OpprettKlagePage");
    return {
        title: t("tittel"),
        description: t("beskrivelse"),
    };
};

export default Page;
