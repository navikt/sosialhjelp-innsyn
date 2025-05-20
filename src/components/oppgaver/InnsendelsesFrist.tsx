import { BodyShort } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React from "react";
import styled from "styled-components";


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
    const t = useTranslations("common");
    if (!props.frist) {
        return null;
    }
    const antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(props.frist));

    return (
        <>
            {antallDagerSidenFristBlePassert <= 0 && (
                <StyledBodyShort spacing>
                    {t("oppgaver.innsendelsesfrist", { innsendelsesfrist: new Date(props.frist) })}
                    {/*{t("oppgaver.innsendelsesfrist", { innsendelsesfrist: formatDato(props.frist, i18n.language) })}*/}
                </StyledBodyShort>
            )}
            {antallDagerSidenFristBlePassert > 0 && (
                <StyledBodyShort spacing>
                    {t("oppgaver.innsendelsesfrist_passert", { innsendelsesfrist: new Date(props.frist) })}
                </StyledBodyShort>
            )}
        </>
    );
};

export default InnsendelsesFrist;
