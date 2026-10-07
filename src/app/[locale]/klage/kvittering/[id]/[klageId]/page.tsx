import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getFlag, getToggles } from "@featuretoggles/unleash";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import { hentKlage } from "@generated/ssr/klage-controller/klage-controller";
import { hentSakForVedtak } from "@generated/ssr/sak-controller/sak-controller";

import Kvittering from "./_components/Kvittering";

const Page = async ({ params }: { params: Promise<{ id: string; klageId: string }> }) => {
    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
    if (!toggle.enabled) {
        return notFound();
    }

    const t = await getTranslations("OpprettKlagePage");
    const tCrumbs = await getTranslations("StatusPage.breadcrumbs");
    const { id: fiksDigisosId, klageId } = await params;
    const klage = await hentKlage(fiksDigisosId, klageId);
    const sak = await hentSakForVedtak(fiksDigisosId, klage.vedtakId);

    return (
        <>
            <ClientBreadcrumbs
                dynamicBreadcrumbs={[
                    { title: tCrumbs("soknader"), url: "/sosialhjelp/innsyn/soknader" },
                    { title: tCrumbs("soknad"), url: `/sosialhjelp/innsyn/soknad/${fiksDigisosId}` },
                    { title: tCrumbs("kvittering") },
                ]}
            />
            <VStack gap="space-16" className="mt-6">
                <Heading size="xlarge" level="1">
                    {t("tittel")}
                </Heading>
                <Kvittering klagePdf={klage.klagePdf} navKontor={sak.navEnhetNavn} />
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
