import React from "react";
import {useTranslation} from "react-i18next";
import {ErrorMessage} from "../errors/ErrorMessage";

export const ErrorMessageTitle = (props: {feilId: string; errorValue: {}}) => {
    const {t} = useTranslation();

    return <ErrorMessage>{t(props.feilId, {errorValue: props.errorValue})}</ErrorMessage>;
};
