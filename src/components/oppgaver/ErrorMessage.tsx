import React from "react";
import {useTranslation} from "react-i18next";
import {ErrorMessage as ErrorMessageLabel} from "../errors/ErrorMessage";

const ErrorMessage = (props: {feilId: string}) => {
    const {t} = useTranslation();

    return (
        <ErrorMessageLabel>
            <ul style={{marginTop: "0px", marginBottom: "0px"}}>
                <li>{t(props.feilId)}</li>
            </ul>
        </ErrorMessageLabel>
    );
};

export default ErrorMessage;
