import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { NavigationGuardProvider } from "next-navigation-guard";

import OpplastingsboksTus from "@components/filopplasting/new/OpplastingsboksTus";
import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";
import { getFlag, getToggles } from "@featuretoggles/unleash";

const metadata = { type: "annet", tilleggsinfo: "annet" };

interface Props {
    id: string;
}

const Filopplasting = async ({ id }: Props) => {
    const t = await getTranslations("Filopplasting");
    const toggle = getFlag("sosialhjelp.innsyn.ny_upload", await getToggles());
    const newUploadEnabled = toggle?.enabled ?? false;
    return (
        <VStack gap="2">
            <Heading size="large" level="2">
                {t("tittel")}
            </Heading>
            <NavigationGuardProvider>
                {newUploadEnabled ? (
                    <OpplastingsboksTus metadata={metadata} id={id} />
                ) : (
                    <Opplastingsboks metadata={metadata} />
                )}
            </NavigationGuardProvider>
        </VStack>
    );
};

export default Filopplasting;
