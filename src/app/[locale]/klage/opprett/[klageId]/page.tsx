import { notFound } from "next/navigation";
import { Bleed, Heading, Show, Stack, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import OkonomiskSosialhjelpIcon from "../../../../../components/ikoner/OkonomiskSosialhjelp";
import { getFlag, getToggles } from "../../../../../featuretoggles/unleash";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
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
                    <Show above="sm">
                        <OkonomiskSosialhjelpIcon className="mr-4" />
                    </Show>
                    <Heading size="xlarge" level="1">
                        Klage på vedtak
                    </Heading>
                </Stack>
            </Bleed>
        </VStack>
    );
};

export default Page;
