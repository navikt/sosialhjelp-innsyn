import styled from "styled-components";
import {Heading, Panel as DsPanel} from "@navikt/ds-react";
import React from "react";

const StyledPanel = styled(DsPanel)<{$error?: boolean}>`
    position: relative;
    border-color: ${(props) => (props.$error ? "var(--a-red-500)" : "transparent")};
    @media screen and (min-width: 641px) {
        padding: 2rem 4.25rem;
        margin-top: 1.5rem;
    }
    @media screen and (max-width: 640px) {
        padding: 1rem;
        margin-top: 1.5rem;
    }
`;

const StyledHeading = styled(Heading)<{$harOppgaver?: boolean}>`
    //border-bottom: 1px solid black;
    border-bottom: 2px solid var(${(props) => (props.lightColor ? "--a-border-on-inverted" : "--a-border-default")});
    padding-bottom: 5px;
`;

interface Props {
    hasError?: boolean;
    harOppgaver?: boolean;
    header?: React.ReactNode | string;
    children: React.ReactNode;
}

const Panel = ({hasError, harOppgaver, header, children}: Props): React.JSX.Element => (
    <StyledPanel $error={hasError}>
        {header && typeof header === "string" ? (
            <StyledHeading level="2" size="medium">
                {header}
            </StyledHeading>
        ) : (
            header
        )}
        {children}
    </StyledPanel>
);

export default Panel;
