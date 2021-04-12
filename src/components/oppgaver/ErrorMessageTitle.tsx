import React from "react";
import {SkjemaelementFeilmelding} from "nav-frontend-skjema";
import {FormattedMessage} from "react-intl";

const ErrorMessageTitle = (props: {feilId: string; filnavn: string; listeMedFil: any}) => {
    if (props.listeMedFil.length > 1) {
        return (
            <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={props.feilId} values={{antallFiler: props.listeMedFil.length}} />
            </SkjemaelementFeilmelding>
        );
    } else if (props.listeMedFil.length === 1) {
        return (
            <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={props.feilId} values={{filnavn: props.filnavn}} />
            </SkjemaelementFeilmelding>
        );
    } else {
        return (
            <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={props.feilId} />
            </SkjemaelementFeilmelding>
        );
    }
};

export default ErrorMessageTitle;
