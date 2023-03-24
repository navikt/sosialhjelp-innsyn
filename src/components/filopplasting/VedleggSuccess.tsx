import React from "react";
import styled from "styled-components";
import {Alert} from "@navikt/ds-react";

const StyledAlert = styled(Alert)`
    margin-top: 1rem;
`;

const VedleggSuccess = ({show}: {show: boolean}) => {
    return show ? <StyledAlert variant="success">Takk! Dokumentasjonen er nå sendt inn.</StyledAlert> : null;
};
export default VedleggSuccess;
