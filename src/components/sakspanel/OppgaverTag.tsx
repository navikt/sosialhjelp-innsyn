import {FormattedMessage} from "react-intl";
import React from "react";
import styled from "styled-components/macro";
import {Tag} from "@navikt/ds-react";

const StyledTag = styled(Tag)`
    white-space: nowrap;
`;

const OppgaverTag = (props: {antallNyeOppgaver?: number}) => {
    return props.antallNyeOppgaver !== undefined && props.antallNyeOppgaver >= 1 ? (
        <StyledTag variant="warning">
            <FormattedMessage id="saker.oppgave" />
        </StyledTag>
    ) : null;
};
export default OppgaverTag;
