import React from "react";
import {SkjemaelementFeilmelding} from "nav-frontend-skjema";
import {FormattedMessage} from "react-intl";

const ErrorMessage = (props: {feilId: string}) => {
    return (
        <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding">
            <li>
                <span className="oppgaver_vedlegg_feilmelding_bullet_point">
                    <FormattedMessage id={props.feilId} />
                </span>
            </li>
        </SkjemaelementFeilmelding>
    );
};

export default ErrorMessage;
