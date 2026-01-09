import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { PropsWithChildren } from "react";

import SokButton from "@components/snarveier/SokButton";

const Snarveier = async ({ children }: PropsWithChildren) => {
    const t = await getTranslations("Snarveier");

    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <SokButton />
            {children}
        </VStack>
    );
};

export default Snarveier;
