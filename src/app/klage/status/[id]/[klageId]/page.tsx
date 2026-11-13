import { Heading, Tag, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { ArrowRedoIcon, FilePdfIcon, HouseIcon } from "@navikt/aksel-icons";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import { hentKlage } from "@generated/ssr/klage-controller/klage-controller";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

import UnderUtviklingInfo from "./_components/UnderUtviklingInfo";
import KlageDokumentasjon from "./_components/KlageDokumentasjon";
import ProsessenVidere from "@components/klage/ProsessenVidere";
import { hentSakForVedtak } from "@generated/ssr";
import Snarveier from "@components/snarveier/Snarveier";

const Page = async ({
    params,
}: {
    params: Promise<{
        id: string;
        klageId: string;
    }>;
}) => {
    const t = await getTranslations("KlagePage");
    const tCrumbs = await getTranslations("StatusPage.breadcrumbs");
    const { id: fiksDigisosId, klageId } = await params;

    const klage = await hentKlage(fiksDigisosId, klageId);
    // TODO: Burde denne være inkludert i klage over?
    const paaklagetSak = await hentSakForVedtak(klage.digisosId, klage.vedtakId);

    return (
        <>
            <ClientBreadcrumbs
                dynamicBreadcrumbs={[
                    { title: tCrumbs("soknader"), url: "/sosialhjelp/innsyn/soknader" },
                    { title: tCrumbs("soknad"), url: `/sosialhjelp/innsyn/soknad/${fiksDigisosId}` },
                    { title: tCrumbs("klage") },
                ]}
            />
            <VStack gap="space-80" className="mt-20">
                <VStack gap="space-16" align="start">
                    <Heading size="xlarge" level="1">
                        {t("tittel")}
                    </Heading>
                    <Tag variant="neutral">{t("sendt", { dato: new Date(klage.timestampSendt) })}</Tag>
                </VStack>
                <UnderUtviklingInfo />
                <DigisosLinkCard
                    href={klage.klagePdf.url}
                    icon={<FilePdfIcon title={t("pdf")} />}
                    cardIcon="external-link"
                    openInNewTab
                    dataColor="accent"
                >
                    {t("klagepdf")}
                </DigisosLinkCard>
                <KlageDokumentasjon
                    fiksDigisosId={fiksDigisosId}
                    klageId={klageId}
                    klagePdf={klage.klagePdf}
                    opplastedeVedlegg={klage.opplastedeVedlegg}
                    ettersendelser={klage.ettersendelser}
                    timestampSendt={klage.timestampSendt}
                />
                <ProsessenVidere navKontor={paaklagetSak.navEnhetNavn} />
                <Snarveier hideSokButton>
                    <li>
                        <DigisosLinkCard href={`/soknad/${fiksDigisosId}`} icon={<ArrowRedoIcon aria-hidden />}>
                            {t("snarveier.tilSoknaden")}
                        </DigisosLinkCard>
                    </li>
                    <li>
                        <DigisosLinkCard href="/" icon={<HouseIcon aria-hidden />}>
                            {t("snarveier.okonomiskSosialhjelp")}
                        </DigisosLinkCard>
                    </li>
                </Snarveier>
            </VStack>
        </>
    );
};

export const generateMetadata = async () => {
    const t = await getTranslations("KlagePage");
    return {
        title: t("tittel"),
        description: t("beskrivelse"),
    };
};

export default Page;
