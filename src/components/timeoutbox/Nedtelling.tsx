import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import {Button} from "@navikt/ds-react";

interface Props {
    onContinueClick: () => void;
    logoutUrl: string;
}

const Nedtelling = (props: Props) => {
    return (
        <div>
            <Innholdstittel className="blokk-s timeoutbox__overskrift">
                <FormattedMessage id="timeout.overskrift" />
            </Innholdstittel>
            <Normaltekst className="blokk-xxs">
                <FormattedMessage id="timeout.nedtelling" />
            </Normaltekst>
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
