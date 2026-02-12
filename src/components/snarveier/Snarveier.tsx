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
        <VStack gap="space-8">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            {!hideSokButton && <SokButton />}
            {children}
        </VStack>
    );
};

export default Snarveier;
