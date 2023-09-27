import styled from "styled-components";
import {Heading, Panel} from "@navikt/ds-react";
import React from "react";
import {useTranslation} from "next-i18next";

const StyledPanel = styled(Panel)<{$error?: boolean}>`
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
const OppgaverPanel = ({hasError, children}: {hasError: boolean; children: React.ReactNode}) => {
    const {t} = useTranslation();

    return (
        <StyledPanel $error={hasError}>
            <Heading level="2" size="medium">
                {t("oppgaver.dine_oppgaver")}
            </Heading>
            {children}
        </StyledPanel>
    );
};

export default OppgaverPanel;
