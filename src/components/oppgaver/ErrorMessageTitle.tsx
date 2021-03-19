import React from "react";
import {SkjemaelementFeilmelding} from "nav-frontend-skjema";
import {FormattedMessage} from "react-intl";

const ErrorMessageTitle = (feilId: string, filnavn: string, listeMedFil: any) => {
    if (listeMedFil.length > 1) {
        return (
            <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={feilId} values={{antallFiler: listeMedFil.length}} />
            </SkjemaelementFeilmelding>
        );
    } else if (listeMedFil.length === 1) {
        return (
            <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={feilId} values={{filnavn: filnavn}} />
            </SkjemaelementFeilmelding>
        );
    } else {
        return (
            <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={feilId} />
            </SkjemaelementFeilmelding>
        );
    }
};

export default ErrorMessageTitle;
