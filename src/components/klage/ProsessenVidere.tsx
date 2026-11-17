import { BodyLong, Box, Heading, Link, ReadMore, VStack } from "@navikt/ds-react";
import { Process, ProcessEvent } from "@navikt/ds-react/Process";
import { useTranslations } from "next-intl";

const ProsessenVidere = () => {
    const t = useTranslations("KlageProsessenVidere");

    return (
        <VStack gap={{ xs: "space-4", md: "space-8" }}>
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <Box borderColor="info-subtle" background="info-soft" borderRadius="12" borderWidth="1" padding="space-16">
                <Process>
                    <ProcessEvent bullet={1} title={t("steg1.tittel")}>
                        {t("steg1.beskrivelse")}
                    </ProcessEvent>
                    <ProcessEvent bullet={2} title={t("steg2.tittel")}>
                        {t("steg2.beskrivelse")}
                    </ProcessEvent>
                    <ProcessEvent>{t("steg2.flereOpplysninger")}</ProcessEvent>
                    <ProcessEvent bullet={3} title={t("steg3.tittel")}>
                        <VStack gap="space-24">
                            <BodyLong>{t("steg3.beskrivelse")}</BodyLong>
                            <BodyLong>
                                {t.rich("steg3.medhold", {
                                    b: (chunks) => <strong>{chunks}</strong>,
                                    i: (chunks) => <em>{chunks}</em>,
                                })}
                            </BodyLong>
                            <BodyLong>
                                {t.rich("steg3.ikkeMedhold", {
                                    b: (chunks) => <strong>{chunks}</strong>,
                                    i: (chunks) => <em>{chunks}</em>,
                                })}
                            </BodyLong>
                            <ReadMore size="large" header={t("lesMer.tittel")}>
                                <BodyLong spacing>{t("lesMer.avsnitt1")}</BodyLong>
                                <BodyLong spacing>{t("lesMer.avsnitt2")}</BodyLong>
                                <Heading size="xsmall" level="3">
                                    {t("lesMer.uenigTittel")}
                                </Heading>
                                <BodyLong>
                                    {t.rich("lesMer.uenigTekst", {
                                        lenke: (chunks) => (
                                            <Link inlineText href="https://www.sivilombudet.no/klage/">
                                                {chunks}
                                            </Link>
                                        ),
                                    })}
                                </BodyLong>
                            </ReadMore>
                        </VStack>
                    </ProcessEvent>
                </Process>
            </Box>
        </VStack>
    );
};

export default ProsessenVidere;
