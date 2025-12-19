import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { FileTextIcon } from "@navikt/aksel-icons";
import { getFlag, getToggles } from "@featuretoggles/unleash";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import { hentKlage } from "@generated/ssr/klage-controller/klage-controller";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

import UnderUtviklingInfo from "./_components/UnderUtviklingInfo";
import ProsessenVidere from "./_components/prosessenVidere";
import Dokumenter from "./_components/Dokumenter";

const Page = async ({
    params,
}: {
    params: Promise<{
        id: string;
        klageId: string;
    }>;
}) => {
    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
    const t = await getTranslations("KlagePage");
    const { id: fiksDigisosId, klageId } = await params;

    if (!toggle.enabled) {
        return notFound();
    }

    const klage = await hentKlage(fiksDigisosId, klageId);

    return (
        <>
            <ClientBreadcrumbs dynamicBreadcrumbs={[{ title: t("tittel") }]} />
            <VStack gap="20" className="mt-20">
                <Heading size="xlarge" level="1">
                    {t("tittel")}
                </Heading>
                <UnderUtviklingInfo />
                <DigisosLinkCard href={`/soknad/${fiksDigisosId}`} icon={<FileTextIcon />}>
                    {t("seVedtak")}
                </DigisosLinkCard>
                <ProsessenVidere klagePdf={klage.klagePdf} />
                <Dokumenter klagePdf={klage.klagePdf} />
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
