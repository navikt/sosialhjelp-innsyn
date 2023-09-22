import * as React from "react";
import {useTranslation} from "next-i18next";
import {BodyLong, Button, Heading} from "@navikt/ds-react";

interface Props {
    onLoginAgainClick: () => void;
}

const LoggetUt = (props: Props) => {
    const {t} = useTranslation();

    return (
        <>
            <Heading level="1" size="large" spacing>
                {t("timeout.overskrift")}
            </Heading>
            <BodyLong spacing>{t("timeout.utlopt")}</BodyLong>
            <div className="timeoutbox__knapperad">
                <Button variant="primary" onClick={props.onLoginAgainClick}>
                    {t("timeout.logginn")}
                </Button>
            </div>
        </>
    );
};

export default LoggetUt;
