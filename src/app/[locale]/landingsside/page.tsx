import { notFound } from "next/navigation";
import { Bleed, Heading, Show, Stack, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import OkonomiskSosialhjelpIcon from "../../../components/ikoner/OkonomiskSosialhjelp";
import { getFlag, getToggles } from "../../../featuretoggles/unleash";
import Snarveier from "../../../components/snarveier/Snarveier";
import NyttigInformasjon from "../../../components/nyttigInformasjon/NyttigInformasjon";
import AktiveSoknader from "../../../components/aktiveSoknader/AktiveSoknader";
import SokButton from "../../../components/sokButton/SokButton";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_landingsside", await getToggles());
    const t = await getTranslations("Landingsside");
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
                        {t("tittel")}
                    </Heading>
                </Stack>
            </Bleed>
            <AktiveSoknader />
            <Snarveier />
            <SokButton />
            <NyttigInformasjon />
        </VStack>
    );
};

export default Page;
