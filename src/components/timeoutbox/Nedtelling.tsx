import * as React from "react";
import {FormattedMessage} from "react-intl";
import {BodyLong, Button, Heading} from "@navikt/ds-react";

interface Props {
    onContinueClick: () => void;
    logoutUrl: string;
}

const Nedtelling = (props: Props) => {
    return (
        <div>
            <Heading level="1" size="large" spacing>
                <FormattedMessage id="timeout.overskrift" />
            </Heading>
            <BodyLong spacing>
                <FormattedMessage id="timeout.nedtelling" />
            </BodyLong>
            <div className="timeoutbox__knapperad">
                <Button variant="primary" onClick={props.onContinueClick}>
                    <FormattedMessage id="timeout.fortsett" />
                </Button>
                <Button variant="tertiary" as="a" href={props.logoutUrl} className="timeoutbox__loggutknapp">
                    <FormattedMessage id="timeout.loggut" />
                </Button>
            </div>
        </div>
    );
};

export default Nedtelling;
