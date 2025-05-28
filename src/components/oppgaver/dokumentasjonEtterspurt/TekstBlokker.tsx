import { BodyShort, Label } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";

import { antallDagerEtterFrist } from "../InnsendelsesFrist";

function getAntallDagerTekst(antallDagerSidenFristBlePassert: number): string {
    return antallDagerSidenFristBlePassert > 1
        ? antallDagerSidenFristBlePassert + " dager"
        : antallDagerSidenFristBlePassert + " dag";
}

interface NesteInnsendelsesFristProps {
    innsendelsesfrist: Date | null;
}
export const NesteInnsendelsesFrist = (props: NesteInnsendelsesFristProps) => {
    const antallDagerSidenFristBlePassert = antallDagerEtterFrist(props.innsendelsesfrist);
    const t = useTranslations("common");

    if (!props.innsendelsesfrist) {
        return null;
    }

    return (
        <BodyShort>
            {antallDagerSidenFristBlePassert <= 0
                ? t("oppgaver.neste_frist", {
                      innsendelsesfrist: new Date(props.innsendelsesfrist),
                  })
                : t("oppgaver.neste_frist_passert", {
                      antall_dager: getAntallDagerTekst(antallDagerSidenFristBlePassert),
                      innsendelsesfrist: new Date(props.innsendelsesfrist),
                  })}
        </BodyShort>
    );
};
export const MaaSendeDokTekst = (props: { dokumentasjonEtterspurtErFraInnsyn: boolean }) => {
    const t = useTranslations("common");

    return (
        <Label as="p">
            {props.dokumentasjonEtterspurtErFraInnsyn
                ? t("oppgaver.maa_sende_dok_veileder")
                : t("oppgaver.maa_sende_dok")}
        </Label>
    );
};
export const InfoOmOppgaver = (props: { dokumentasjonEtterspurtErFraInnsyn: boolean }) => {
    const t = useTranslations("common");

    return props.dokumentasjonEtterspurtErFraInnsyn ? (
        <BodyShort>{t("oppgaver.veileder_trenger_mer")}</BodyShort>
    ) : (
        <BodyShort>{t("oppgaver.last_opp_vedlegg_ikke")}</BodyShort>
    );
};
