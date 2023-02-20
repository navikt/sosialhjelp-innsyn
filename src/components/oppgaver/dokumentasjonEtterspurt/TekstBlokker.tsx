import {antallDagerEtterFrist} from "../Oppgaver";
import {BodyShort, Label} from "@navikt/ds-react";
import {FormattedMessage} from "react-intl";
import {formatDato} from "../../../utils/formatting";
import React from "react";

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

    return (
        <BodyShort>
            {antallDagerSidenFristBlePassert <= 0 ? (
                <FormattedMessage
                    id="oppgaver.neste_frist"
                    values={{
                        innsendelsesfrist: props.innsendelsesfrist
                            ? formatDato(props.innsendelsesfrist.toISOString())
                            : "",
                    }}
                />
            ) : (
                <FormattedMessage
                    id="oppgaver.neste_frist_passert"
                    values={{
                        antall_dager: getAntallDagerTekst(antallDagerSidenFristBlePassert),
                        innsendelsesfrist: props.innsendelsesfrist
                            ? formatDato(props.innsendelsesfrist.toISOString())
                            : "",
                    }}
                />
            )}
        </BodyShort>
    );
};
export const MaaSendeDokTekst = (props: {dokumentasjonEtterspurtErFraInnsyn: boolean}) => {
    return (
        <Label as="p">
            {props.dokumentasjonEtterspurtErFraInnsyn ? (
                <FormattedMessage id="oppgaver.maa_sende_dok_veileder" />
            ) : (
                <FormattedMessage id="oppgaver.maa_sende_dok" />
            )}
        </Label>
    );
};
export const InfoOmOppgaver = (props: {dokumentasjonEtterspurtErFraInnsyn: boolean}) => {
    return props.dokumentasjonEtterspurtErFraInnsyn ? (
        <BodyShort>
            <FormattedMessage id="oppgaver.veileder_trenger_mer" />
        </BodyShort>
    ) : (
        <BodyShort>
            <FormattedMessage id="oppgaver.last_opp_vedlegg_ikke" />
        </BodyShort>
    );
};
