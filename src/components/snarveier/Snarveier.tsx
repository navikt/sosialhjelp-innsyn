import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { PropsWithChildren } from "react";

import SokButton from "@components/snarveier/SokButton";

interface SnarveierProps extends PropsWithChildren {
    hideSokButton?: boolean;
}

const Snarveier = async ({ children, hideSokButton = false }: SnarveierProps) => {
    const t = await getTranslations("Snarveier");

    return (
        <VStack gap="space-8" as="nav" aria-labelledby="snarveier-heading">
            <Heading size="medium" level="2" id="snarveier-heading">
                {t("tittel")}
            </Heading>

            <VStack gap="space-8" as="ul">
                {!hideSokButton && <SokButton />}
                {children}
            </VStack>
        </VStack>
    );
};

export default Snarveier;
