import {BodyShort, Label} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import {formatDato} from "../../../utils/formatting";
import React from "react";
import {antallDagerEtterFrist} from "../InnsendelsesFrist";

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
    const {t} = useTranslation();

    return (
        <BodyShort>
            {antallDagerSidenFristBlePassert <= 0
                ? t("oppgaver.neste_frist", {
                      innsendelsesfrist: props.innsendelsesfrist
                          ? formatDato(props.innsendelsesfrist.toISOString())
                          : "",
                  })
                : t("oppgaver.neste_frist_passert", {
                      antall_dager: getAntallDagerTekst(antallDagerSidenFristBlePassert),
                      innsendelsesfrist: props.innsendelsesfrist
                          ? formatDato(props.innsendelsesfrist.toISOString())
                          : "",
                  })}
        </BodyShort>
    );
};
export const MaaSendeDokTekst = (props: {dokumentasjonEtterspurtErFraInnsyn: boolean}) => {
    const {t} = useTranslation();

    return (
        <Label as="p">
            {props.dokumentasjonEtterspurtErFraInnsyn
                ? t("oppgaver.maa_sende_dok_veileder")
                : t("oppgaver.maa_sende_dok")}
        </Label>
    );
};
export const InfoOmOppgaver = (props: {dokumentasjonEtterspurtErFraInnsyn: boolean}) => {
    const {t} = useTranslation();

    return props.dokumentasjonEtterspurtErFraInnsyn ? (
        <BodyShort>{t("oppgaver.veileder_trenger_mer")}</BodyShort>
    ) : (
        <BodyShort>{t("oppgaver.last_opp_vedlegg_ikke")}</BodyShort>
    );
};
