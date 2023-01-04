import React from "react";
import {FormattedMessage} from "react-intl";
import {ErrorMessage} from "../errors/ErrorMessage";

export const ErrorMessageTitle = (props: {feilId: string; errorValue: {}}) => {
    return (
        <ErrorMessage>
            <FormattedMessage id={props.feilId} values={props.errorValue} />
        </ErrorMessage>
    );
};
