import React from "react";
import {SkjemaelementFeilmelding} from "nav-frontend-skjema";
import {FormattedMessage} from "react-intl";
import {FileValidationErrors} from "./DokumentasjonKravView";

export const ErrorMessageTitle = (props: {feilId: string; errorValue: {}}) => {
    //case 1: 1 fil skrive ut filenavn
    //case 2: flere filer skrive ut antall filer

    return (
        <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_overskrift">
            <FormattedMessage id={props.feilId} values={props.errorValue} />
        </SkjemaelementFeilmelding>
    );
};
