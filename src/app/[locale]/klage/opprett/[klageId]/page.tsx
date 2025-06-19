import { notFound } from "next/navigation";
import { Heading } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getFlag, getToggles } from "../../../../../featuretoggles/unleash";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
    const t = await getTranslations("NyKlagePage");
    if (!toggle.enabled) {
        return notFound();
    }
    return (
        <Heading size="xlarge" level="1" className="mt-20">
            {t("tittel")}
        </Heading>
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
