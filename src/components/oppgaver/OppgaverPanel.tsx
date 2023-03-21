import styled from "styled-components";
import {Heading, Panel} from "@navikt/ds-react";
import React from "react";
import {useTranslation} from "react-i18next";

const StyledPanelHeader = styled.div`
    border-bottom: 2px solid var(--a-border-default);
`;

const StyledPanel = styled(Panel)<{$error?: boolean}>`
    position: relative;
    border-color: ${(props) => (props.$error ? "var(--a-red-500)" : "transparent")};
    @media screen and (min-width: 641px) {
        padding: 2rem 4.25rem;
        margin-top: 4rem;
    }
    @media screen and (max-width: 640px) {
        padding: 1rem;
        margin-top: 2rem;
    }
`;
const OppgaverPanel = ({hasError, children}: {hasError: boolean; children: React.ReactNode}) => {
    const {t} = useTranslation();

    return (
        <StyledPanel $error={hasError}>
            <StyledPanelHeader>
                <Heading level="2" size="medium">
                    {t("oppgaver.dine_oppgaver")}
                </Heading>
            </StyledPanelHeader>
            {children}
        </StyledPanel>
    );
};

export default OppgaverPanel;
