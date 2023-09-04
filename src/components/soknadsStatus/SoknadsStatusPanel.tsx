import styled from "styled-components";
import {Panel} from "@navikt/ds-react";
import React from "react";
import SoknadsStatusDecoration from "./SoknadsStatusDecoration";
import SoknadsStatusHeading from "./SoknadsStatusHeading";
import {SoknadsStatusResponseStatus} from "../../generated/model";

const StyledPanel = styled(Panel)<{$error?: boolean}>`
    position: relative;
    border-color: ${(props) => (props.$error ? "var(--a-red-500)" : "transparent")};
    @media screen and (min-width: 641px) {
        padding: 2rem 4.25rem;
        margin-top: 4rem;
    }
    @media screen and (max-width: 640px) {
        padding: 2rem 4.25rem;
        margin-top: 2.5rem;
    }
`;

interface Props {
    hasError: boolean;
    children: React.ReactNode;
    soknadsStatus?: SoknadsStatusResponseStatus;
}

const SoknadsStatusPanel = ({hasError, children, soknadsStatus}: Props) => {
    return (
        <StyledPanel $error={hasError}>
            <SoknadsStatusDecoration />
            <SoknadsStatusHeading soknadsStatus={soknadsStatus} />

            {children}
        </StyledPanel>
    );
};
export default SoknadsStatusPanel;
