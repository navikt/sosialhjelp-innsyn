import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { NavigationGuardProvider } from "next-navigation-guard";

import Opplastingsboks from "./Opplastingsboks";

const Filopplasting = async () => {
    const t = await getTranslations("Filopplasting");
    return (
        <VStack gap="2">
            <Heading size="large" level="2">
                {t("tittel")}
            </Heading>
            <NavigationGuardProvider>
                <Opplastingsboks />
            </NavigationGuardProvider>
        </VStack>
    );
};

export default Filopplasting;
