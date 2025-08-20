import { BodyShort, Box, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { VilkarResponse } from "@generated/model";

import Vilkar from "./Vilkar";

interface Props {
    vilkar: VilkarResponse[];
}

const VilkarListe = ({ vilkar }: Props) => {
    const t = useTranslations("VilkarListe");
    return (
        <VStack gap="4">
            <Box>
                <Heading level="3" size="medium" spacing>
                    {t("tittel")}
                </Heading>
                <BodyShort>{t("beskrivelse")}</BodyShort>
            </Box>
            {vilkar.map((it) => (
                <Vilkar key={it.vilkarReferanse} vilkar={it} />
            ))}
        </VStack>
    );
};

export default VilkarListe;
