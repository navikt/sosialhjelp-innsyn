import { notFound } from "next/navigation";
import { BodyShort, Heading } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getFlag, getToggles } from "../../../../../../featuretoggles/unleash";
import ClientBreadcrumbs from "../../../../../../components/breadcrumbs/ClientBreadcrumbs";

import KlageForm from "./klageForm";

const Page = async ({ params }: { params: Promise<{ id: string; vedtaksId: string }> }) => {
    const { id: fiksDigisosId, vedtaksId } = await params;

    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
    const t = await getTranslations("NyKlagePage");

    if (!toggle.enabled) {
        return notFound();
    }

    return (
        <>
            <ClientBreadcrumbs dynamicBreadcrumbs={[{ title: t("tittel") }]} />
            <div className="mb-20">
                <Heading size="xlarge" level="1" className="mt-20">
                    {t("tittel")}
                </Heading>
                <BodyShort>
                    FiksDigisosId: {fiksDigisosId}, vedtaksID: {vedtaksId}
                </BodyShort>
            </div>

            <KlageForm />
        </>
    );
};

export const generateMetadata = async () => {
    const t = await getTranslations("NyKlagePage");
    return {
        title: t("tittel"),
        description: t("beskrivelse"),
    };
};

export default Page;
