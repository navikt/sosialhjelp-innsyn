import { notFound } from "next/navigation";
import { Heading } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getFlag, getToggles } from "../../../../../featuretoggles/unleash";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
    const t = await getTranslations("klage");
    if (!toggle.enabled) {
        return notFound();
    }
    return (
        <Heading size="xlarge" level="1">
            {t("opprett.tittel")}
        </Heading>
    );
};

export const generateMetadata = async () => {
    const t = await getTranslations("klage");
    return {
        title: t("opprett.tittel"),
        description: t("opprett.beskrivelse"),
    };
};

export default Page;
