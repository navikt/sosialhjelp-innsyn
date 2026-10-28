import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";
import { randomUUID } from "node:crypto";
import { getFlag, getToggles } from "@featuretoggles/unleash";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import { hentSakForVedtak } from "@generated/ssr/sak-controller/sak-controller";

import KlageForm from "./_components/KlageForm";

const Page = async ({ params }: { params: Promise<{ id: string; vedtakId: string }> }) => {
    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
    if (!toggle.enabled) {
        return notFound();
    }

    const t = await getTranslations("OpprettKlagePage");
    const tCrumbs = await getTranslations("StatusPage.breadcrumbs");
    const { id: fiksDigisosId, vedtakId } = await params;

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
            <VStack gap="space-16" className="mt-6">
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
