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
                <ChipsToggle checkmark={false}>Kommende</ChipsToggle>
                <ChipsToggle checkmark={false}>Siste 3 måneder</ChipsToggle>
                <ChipsToggle checkmark={false}>Hitil i år</ChipsToggle>
                <ChipsToggle checkmark={false}>I fjor</ChipsToggle>
                <ChipsToggle checkmark={false}>Egendefinert</ChipsToggle>
            </Chips>
        </VStack>
    );
};

export default Page;
