import React from "react";
import {FormattedMessage} from "react-intl";
import {ErrorMessage} from "../errors/ErrorMessage";

const ErrorMessageTitle = (props: {feilId: string; filnavn: string; listeMedFil: any}) => {
    if (props.listeMedFil.length > 1) {
        return (
            <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={props.feilId} values={{antallFiler: props.listeMedFil.length}} />
            </ErrorMessage>
        );
    } else if (props.listeMedFil.length === 1) {
        return (
            <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={props.feilId} values={{filnavn: props.filnavn}} />
            </ErrorMessage>
        );
    } else {
        return (
            <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={props.feilId} />
            </ErrorMessage>
        );
    }
};

export default ErrorMessageTitle;
