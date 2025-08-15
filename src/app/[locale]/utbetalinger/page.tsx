import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { VStack } from "@navikt/ds-react";

import { getFlag, getToggles } from "@featuretoggles/unleash";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_utbetalinger_side", await getToggles());
    const t = await getTranslations("UtbetalingerSide");
    if (!toggle.enabled) {
        return notFound();
    }

    return <VStack>{t("tittel")}</VStack>;
};

export default Page;
