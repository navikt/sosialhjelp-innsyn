"use client";

import { Alert, Button, HStack, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

interface Props {
    isLoading: boolean;
    isError: boolean;
    onTilbake: () => void;
}

const StegOppsummering = ({ isLoading, isError, onTilbake }: Props) => {
    const t = useTranslations("KlageForm");

    return (
        <VStack gap="space-20">
            <VStack gap="space-8">
                <HStack gap="space-4">
                    <Button loading={isLoading} type="submit" className="mb-4">
                        {t("sendKlage")}
                    </Button>
                    <Button onClick={onTilbake} type="button" className="mb-4" variant="secondary">
                        {t("tilbakeKnapp")}
                    </Button>
                </HStack>
                {isError && <Alert variant="error">{t("sendingFeilet")}</Alert>}
            </VStack>
        </VStack>
    );
};

export default StegOppsummering;
