import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { PropsWithChildren } from "react";

import SokButton from "@components/snarveier/SokButton";

const Snarveier = async ({ children }: PropsWithChildren) => {
    const t = await getTranslations("Snarveier");

    return (
        <VStack gap="2" as="nav" aria-labelledby="snarveier-heading">
            <Heading size="medium" level="2" id="snarveier-heading">
                {t("tittel")}
            </Heading>

            <VStack gap="2" as="ul">
                <SokButton />
                {children}
            </VStack>
        </VStack>
    );
};

export default Snarveier;
