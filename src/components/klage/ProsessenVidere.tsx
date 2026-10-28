import { BodyLong, Box, ReadMore } from "@navikt/ds-react";
import { Process, ProcessEvent } from "@navikt/ds-react/Process";
import { useTranslations } from "next-intl";

type Props = {
    navKontor?: string | null;
};

const ProsessenVidere = ({ navKontor }: Props) => {
    const t = useTranslations("KlageProsessenVidere");

    return (
        <Box
            borderColor="info-subtle"
            background="info-soft"
            borderRadius="12"
            borderWidth="1"
            paddingBlock="space-8"
            paddingInline="space-16"
        >
            <Process>
                <ProcessEvent bullet={1} title={t("steg1.tittel")}>
                    {navKontor ? t("steg1.beskrivelse", { navKontor }) : t("steg1.beskrivelseUtenKontor")}
                </ProcessEvent>
                <ProcessEvent bullet={2} title={t("steg2.tittel")}>
                    {t("steg2.beskrivelse")}
                </ProcessEvent>
                <ProcessEvent bullet={3} title={t("steg3.tittel")}>
                    <span>{t("steg3.beskrivelse")}</span>
                    <ReadMore header={t("steg3.lesMer.tittel")}>
                        <BodyLong spacing>
                            {t.rich("steg3.lesMer.innhold.medhold", {
                                b: (chunks) => <strong>{chunks}</strong>,
                            })}
                        </BodyLong>
                        <BodyLong>
                            {t.rich("steg3.lesMer.innhold.ikkeMedhold", {
                                b: (chunks) => <strong>{chunks}</strong>,
                            })}
                        </BodyLong>
                    </ReadMore>
                </ProcessEvent>
            </Process>
        </Box>
    );
};

export default ProsessenVidere;
