import React from "react";
import {FormattedMessage} from "react-intl";
import {ErrorMessage as ErrorMessageLabel} from "../errors/ErrorMessage";

const ErrorMessage = (props: {feilId: string}) => {
    return (
        <ErrorMessageLabel>
            <ul style={{marginTop: "0px", marginBottom: "0px"}}>
                <li>
                    <FormattedMessage id={props.feilId} />
                </li>
            </ul>
        </ErrorMessageLabel>
    );
};

export default ErrorMessage;
