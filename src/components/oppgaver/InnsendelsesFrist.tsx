import {BodyShort} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";
import {formatDato} from "../../utils/formatting";
import React from "react";

export const antallDagerEtterFrist = (innsendelsesfrist: null | Date): number => {
    if (!innsendelsesfrist) {
        return 0;
    }
    let now = Math.floor(new Date().getTime() / (3600 * 24 * 1000)); //days as integer from..
    let frist = Math.floor(innsendelsesfrist.getTime() / (3600 * 24 * 1000)); //days as integer from..
    return now - frist;
};

interface Props {
    frist?: string;
}
const InnsendelsesFrist = (props: Props) => {
    const {t} = useTranslation();

    if (!props.frist) {
        return null;
    }
    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(props.frist));

    return (
        <>
            {antallDagerSidenFristBlePassert <= 0 && (
                <BodyShort spacing>
                    {t("oppgaver.innsendelsesfrist", {innsendelsesfrist: formatDato(props.frist)})}
                </BodyShort>
            )}
            {antallDagerSidenFristBlePassert > 0 && (
                <BodyShort spacing>
                    {t("oppgaver.innsendelsesfrist_passert", {innsendelsesfrist: formatDato(props.frist)})}
                </BodyShort>
            )}{" "}
        </>
    );
};

export default InnsendelsesFrist;
