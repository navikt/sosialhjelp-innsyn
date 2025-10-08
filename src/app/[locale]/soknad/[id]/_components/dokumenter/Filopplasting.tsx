import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { NavigationGuardProvider } from "next-navigation-guard";

import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";
import { Metadata } from "@components/filopplasting/new/types";

const metadata = { vedleggsKontekst: "ettersendelse", type: "annet", tilleggsinfo: "annet" } satisfies Metadata;

const Filopplasting = async () => {
    const t = await getTranslations("Filopplasting");
    return (
        <VStack gap="2">
            <Heading size="large" level="2">
                {t("tittel")}
            </Heading>
            <NavigationGuardProvider>
                <Opplastingsboks metadata={metadata} />
            </NavigationGuardProvider>
        </VStack>
    );
};

export default Filopplasting;
