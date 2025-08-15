import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Chips, Heading, VStack } from "@navikt/ds-react";
import { ChipsToggle } from "@navikt/ds-react/Chips";

import { getFlag, getToggles } from "@featuretoggles/unleash";

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
            <Chips>
                <ChipsToggle checkmark={false}>hei 1</ChipsToggle>
                <ChipsToggle checkmark={false}>hei 2</ChipsToggle>
                <ChipsToggle checkmark={false}>hei 3</ChipsToggle>
                <ChipsToggle checkmark={false}>hei 4</ChipsToggle>
            </Chips>
        </VStack>
    );
};

export default Page;
