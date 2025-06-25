import { notFound } from "next/navigation";
import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getFlag, getToggles } from "../../../featuretoggles/unleash";
import NyttigInformasjon from "../../../components/nyttigInformasjon/NyttigInformasjon";
import AktiveSoknader from "../../../components/aktiveSoknader/AktiveSoknader";
import TidligereSoknader from "../../../components/tidligereSoknader/TidligereSoknader";
import SokButton from "../../../components/sokButton/SokButton";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_soknaderside", await getToggles());
    const t = await getTranslations("SoknaderSide");
    if (!toggle.enabled) {
        return notFound();
    }

    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {t("tittel")}
            </Heading>

            <AktiveSoknader />
            <TidligereSoknader />
            <SokButton />
            <NyttigInformasjon />
        </VStack>
    );
};

export default Page;
