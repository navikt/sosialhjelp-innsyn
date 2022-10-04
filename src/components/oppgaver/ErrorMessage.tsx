import React from "react";
import {FormattedMessage} from "react-intl";
import {ErrorMessage as ErrorMessageLabel} from "../errors/ErrorMessage";

const ErrorMessage = (props: {feilId: string}) => {
    return (
        <ErrorMessageLabel>
            <li>
                <span className="oppgaver_vedlegg_feilmelding_bullet_point">
                    <FormattedMessage id={props.feilId} />
                </span>
            </li>
        </ErrorMessageLabel>
    );
};

export default ErrorMessage;
