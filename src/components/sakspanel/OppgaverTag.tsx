import { useTranslations } from "next-intl";
import React from "react";
import styled from "styled-components";
import { Tag } from "@navikt/ds-react";

const StyledTag = styled(Tag)`
    white-space: nowrap;
`;

const OppgaverTag = (props: { antallNyeOppgaver?: number }) => {
    const t = useTranslations("common");

    return props.antallNyeOppgaver !== undefined && props.antallNyeOppgaver >= 1 ? (
        <StyledTag variant="warning">{t("saker.oppgave")}</StyledTag>
    ) : null;
};
export default OppgaverTag;
