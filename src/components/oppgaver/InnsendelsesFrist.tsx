import {BodyShort} from "@navikt/ds-react";
import {FormattedMessage} from "react-intl";
import {formatDato} from "../../utils/formatting";
import React from "react";
import {antallDagerEtterFrist} from "./Oppgaver";

interface Props {
    frist?: string;
}
const InnsendelsesFrist = (props: Props) => {
    if (!props.frist) {
        return null;
    }
    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(props.frist));

    return (
        <>
            {antallDagerSidenFristBlePassert <= 0 && (
                <BodyShort spacing>
                    <FormattedMessage
                        id="oppgaver.innsendelsesfrist"
                        values={{innsendelsesfrist: formatDato(props.frist)}}
                    />
                </BodyShort>
            )}
            {antallDagerSidenFristBlePassert > 0 && (
                <BodyShort spacing>
                    <FormattedMessage
                        id="oppgaver.innsendelsesfrist_passert"
                        values={{innsendelsesfrist: formatDato(props.frist)}}
                    />
                </BodyShort>
            )}
        </>
    );
};

export default InnsendelsesFrist;
