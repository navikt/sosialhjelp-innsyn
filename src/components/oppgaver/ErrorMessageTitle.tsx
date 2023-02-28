import React from "react";
import {useTranslation} from "react-i18next";
import {ErrorMessage} from "../errors/ErrorMessage";

const ErrorMessageTitle = (props: {feilId: string; filnavn: string; listeMedFil: any}) => {
    const {t} = useTranslation();

    if (props.listeMedFil.length > 1) {
        return (
            <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">
                {t(props.feilId, {antallFiler: props.listeMedFil.length})}
            </ErrorMessage>
        );
    } else if (props.listeMedFil.length === 1) {
        return (
            <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">
                {t(props.feilId, {filnavn: props.filnavn})}
            </ErrorMessage>
        );
    } else {
        return <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">{t(props.feilId)}</ErrorMessage>;
    }
};

export default ErrorMessageTitle;
