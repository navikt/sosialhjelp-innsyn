import React from "react";
import {FormattedMessage} from "react-intl";
import {ErrorMessage} from "../errors/ErrorMessage";

export const ErrorMessageTitle = (props: {feilId: string; errorValue: {}}) => {
    return (
        <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">
            <FormattedMessage id={props.feilId} values={props.errorValue} />
        </ErrorMessage>
    );
};
