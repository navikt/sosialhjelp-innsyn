import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { NavigationGuardProvider } from "next-navigation-guard";

import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";

const metadata = { type: "annet", tilleggsinfo: "annet" };

interface Props {
    id: string;
}

const Filopplasting = async ({ id }: Props) => {
    const t = await getTranslations("Filopplasting");
    return (
        <VStack gap="2">
            <Heading size="large" level="2">
                {t("tittel")}
            </Heading>
            <NavigationGuardProvider>
                <Opplastingsboks metadata={metadata} id={id} />
            </NavigationGuardProvider>
        </VStack>
    );
};

export default Filopplasting;
