import { getTranslations } from "next-intl/server";
import { Heading, VStack } from "@navikt/ds-react";
import React from "react";

interface Props {
    id: string;
}

const Vilkar = async ({ id }: Props) => {
    const t = await getTranslations("Vilkar");
    // Here you would typically fetch any necessary data related to the "vilkar" (conditions) for the application.
    return (
        <VStack gap="2">
            <Heading size="large" level="2">
                {t("tittel")}
            </Heading>

        </VStack>
    );
};

export default Vilkar;
