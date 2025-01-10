import styled from "styled-components";
import { Loader } from "@navikt/ds-react";
import * as React from "react";

const StyledSpinner = styled.div`
    width: 100%;
    text-align: center;
    padding-top: 100px;
`;

export const ApplicationSpinner = () => (
    <StyledSpinner>
        <Loader size="2xlarge" />
    </StyledSpinner>
);
