import { BodyShort, Box, Heading, Tag, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { NavigationGuardProvider } from "next-navigation-guard";

import { DokumentasjonkravDto } from "@generated/model";
import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";

interface Props {
    dokumentasjonkrav: DokumentasjonkravDto[];
}

const Dokumentasjonkrav = ({ dokumentasjonkrav }: Props) => {
    const t = useTranslations("Dokumentasjonkrav");
    return (
        <VStack gap="4">
            <Box>
                <Heading level="3" size="medium" spacing>
                    {t("tittel")}
                </Heading>
                <BodyShort>{t(`beskrivelse`)}</BodyShort>
            </Box>
            <NavigationGuardProvider>
                {dokumentasjonkrav.map((it) => (
                    <Box.New key={it.dokumentasjonkravId} background="neutral-soft" padding="space-24">
                        <Opplastingsboks
                            metadata={{
                                type: it.tittel ?? "dokumentasjonkrav",
                                tilleggsinfo: it.beskrivelse,
                                hendelsereferanse: it.dokumentasjonkravReferanse,
                                hendelsetype: it.hendelsetype,
                                innsendelsesfrist: it.frist,
                            }}
                            label={it.tittel}
                            description={it.beskrivelse}
                            completed={it.erLastetOpp}
                            tag={
                                it.opplastetDato ? (
                                    <Tag variant="success">{t("løst")}</Tag>
                                ) : it.frist ? (
                                    <Tag variant="warning">{t("frist", { frist: new Date(it.frist) })}</Tag>
                                ) : undefined
                            }
                        />
                    </Box.New>
                ))}
            </NavigationGuardProvider>
        </VStack>
    );
};

export default Dokumentasjonkrav;
