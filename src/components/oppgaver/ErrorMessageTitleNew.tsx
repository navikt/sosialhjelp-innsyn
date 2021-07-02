import React from "react";
import {SkjemaelementFeilmelding} from "nav-frontend-skjema";
import {FormattedMessage} from "react-intl";

export const ErrorMessageTitle = (props: {feilId: string; errorValue: {}}) => {
    return (
        <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_overskrift">
            <FormattedMessage id={props.feilId} values={props.errorValue} />
        </SkjemaelementFeilmelding>
    );
};
