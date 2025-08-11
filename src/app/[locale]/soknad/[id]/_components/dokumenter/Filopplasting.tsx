import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { NavigationGuardProvider } from "next-navigation-guard";

import Opplastingsboks from "@components/opplastingsboks/Opplastingsboks";

const metadatas = [{ type: "annet", tilleggsinfo: "annet" }];

const Filopplasting = async () => {
    const t = await getTranslations("Filopplasting");
    return (
        <VStack gap="2">
            <Heading size="large" level="2">
                {t("tittel")}
            </Heading>
            <NavigationGuardProvider>
                <Opplastingsboks metadatas={metadatas} />
            </NavigationGuardProvider>
        </VStack>
    );
};

export default Filopplasting;
