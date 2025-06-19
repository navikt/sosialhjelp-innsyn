import { notFound } from "next/navigation";
import { Bleed, Heading, Stack, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getFlag, getToggles } from "../../../../../featuretoggles/unleash";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
    const t = await getTranslations("klage");
    if (!toggle.enabled) {
        return notFound();
    }
    return (
        <VStack gap="20" className="mt-20">
            <Bleed marginInline={{ lg: "24" }} asChild>
                <Stack
                    gap="4"
                    direction={{ sm: "row-reverse", lg: "row" }}
                    justify={{ sm: "space-between", lg: "start" }}
                    wrap={false}
                >
                    <Heading size="xlarge" level="1">
                        {t("opprett.tittel")}
                    </Heading>
                </Stack>
            </Bleed>
        </VStack>
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
