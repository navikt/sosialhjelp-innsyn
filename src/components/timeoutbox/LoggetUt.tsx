import * as React from "react";
import {FormattedMessage} from "react-intl";
import {BodyLong, Button, Heading} from "@navikt/ds-react";

interface Props {
    onLoginAgainClick: () => void;
}

const LoggetUt = (props: Props) => {
    return (
        <>
            <Heading level="1" size="large" spacing>
                <FormattedMessage id="timeout.overskrift" />
            </Heading>
            <BodyLong spacing>
                <FormattedMessage id="timeout.utlopt" />
            </BodyLong>
            <div className="timeoutbox__knapperad">
                <Button variant="primary" onClick={props.onLoginAgainClick}>
                    <FormattedMessage id="timeout.logginn" />
                </Button>
            </div>
        </>
    );
};

export default LoggetUt;
