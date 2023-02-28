import * as React from "react";
import {useTranslation} from "react-i18next";
import {BodyLong, Button, Heading} from "@navikt/ds-react";

interface Props {
    onContinueClick: () => void;
    logoutUrl: string;
}

const Nedtelling = (props: Props) => {
    const {t} = useTranslation();

    return (
        <div>
            <Heading level="1" size="large" spacing>
                {t("timeout.overskrift")}
            </Heading>
            <BodyLong spacing>{t("timeout.nedtelling")}</BodyLong>
            <div className="timeoutbox__knapperad">
                <Button variant="primary" onClick={props.onContinueClick}>
                    {t("timeout.fortsett")}
                </Button>
                <Button variant="tertiary" as="a" href={props.logoutUrl} className="timeoutbox__loggutknapp">
                    {t("timeout.loggut")}
                </Button>
            </div>
        </div>
    );
};

export default Nedtelling;
