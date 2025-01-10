import { BodyShort, Label } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";
import React from "react";

import { formatDato } from "../../../utils/formatting";
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
    const { t, i18n } = useTranslation();

    return (
        <BodyShort>
            {antallDagerSidenFristBlePassert <= 0
                ? t("oppgaver.neste_frist", {
                      innsendelsesfrist: props.innsendelsesfrist
                          ? formatDato(props.innsendelsesfrist.toISOString(), i18n.language)
                          : "",
                  })
                : t("oppgaver.neste_frist_passert", {
                      antall_dager: getAntallDagerTekst(antallDagerSidenFristBlePassert),
                      innsendelsesfrist: props.innsendelsesfrist
                          ? formatDato(props.innsendelsesfrist.toISOString(), i18n.language)
                          : "",
                  })}
        </BodyShort>
    );
};
export const MaaSendeDokTekst = (props: { dokumentasjonEtterspurtErFraInnsyn: boolean }) => {
    const { t } = useTranslation();

    return (
        <Label as="p">
            {props.dokumentasjonEtterspurtErFraInnsyn
                ? t("oppgaver.maa_sende_dok_veileder")
                : t("oppgaver.maa_sende_dok")}
        </Label>
    );
};
export const InfoOmOppgaver = (props: { dokumentasjonEtterspurtErFraInnsyn: boolean }) => {
    const { t } = useTranslation();

    return props.dokumentasjonEtterspurtErFraInnsyn ? (
        <BodyShort>{t("oppgaver.veileder_trenger_mer")}</BodyShort>
    ) : (
        <BodyShort>{t("oppgaver.last_opp_vedlegg_ikke")}</BodyShort>
    );
};
