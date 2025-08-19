import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Heading, VStack } from "@navikt/ds-react";

import { getFlag, getToggles } from "@featuretoggles/unleash";

import { UtbetalingerChipProvider } from "../../../utbetalinger/UtbetalingerProviderContext";

import Utbetalinger from "./_components/Utbetalinger";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_utbetalinger_side", await getToggles());
    const t = await getTranslations("UtbetalingerSide");
    if (!toggle.enabled) {
        return notFound();
    }

    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {t("tittel")}
            </Heading>
            <UtbetalingerChipProvider>
                <Utbetalinger />
            </UtbetalingerChipProvider>
        </VStack>
    );
};

export default Page;
