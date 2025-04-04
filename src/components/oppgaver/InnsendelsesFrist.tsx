import { BodyShort } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";
import React from "react";
import styled from "styled-components";

import { formatDato } from "../../utils/formatting";

export const antallDagerEtterFrist = (innsendelsesfrist: null | Date): number => {
    if (!innsendelsesfrist) {
        return 0;
    }
    const now = Math.floor(new Date().getTime() / (3600 * 24 * 1000)); //days as integer from..
    const frist = Math.floor(innsendelsesfrist.getTime() / (3600 * 24 * 1000)); //days as integer from..
    return now - frist;
};
const StyledBodyShort = styled(BodyShort)`
    font-weight: bold;
`;
interface Props {
    frist?: string;
}
const InnsendelsesFrist = (props: Props) => {
    const { t, i18n } = useTranslation();

    if (!props.frist) {
        return null;
    }
    const antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(props.frist));

    return (
        <>
            {antallDagerSidenFristBlePassert <= 0 && (
                <StyledBodyShort spacing>
                    {t("oppgaver.innsendelsesfrist", { innsendelsesfrist: formatDato(props.frist, i18n.language) })}
                </StyledBodyShort>
            )}
            {antallDagerSidenFristBlePassert > 0 && (
                <StyledBodyShort spacing>
                    {t("oppgaver.innsendelsesfrist_passert", {
                        innsendelsesfrist: formatDato(props.frist, i18n.language),
                    })}
                </StyledBodyShort>
            )}{" "}
        </>
    );
};

export default InnsendelsesFrist;
