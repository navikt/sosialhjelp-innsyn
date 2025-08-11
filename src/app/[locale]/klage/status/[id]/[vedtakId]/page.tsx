import { Heading } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getFlag, getToggles } from "@featuretoggles/unleash";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
    const t = await getTranslations("KlagePage");

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
            </div>
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
