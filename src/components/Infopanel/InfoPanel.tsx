import React from "react";
import { LinkPanel } from "@navikt/ds-react";
import styled from "styled-components";

const WRAP_WIDTH = "42em";
export const InfoPanelWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
    gap: 1rem;
    @media screen and (max-width: ${WRAP_WIDTH}) {
        flex-direction: column;
    }
`;

const StyledLinkPanel = styled(LinkPanel)`
    align-items: stretch;
    display: flex;
    justify-content: space-between;
    flex: 1;
    flex-direction: column;

    .navds-link-panel__chevron {
        align-self: center;
    }

    @media screen and (max-width: ${WRAP_WIDTH}) {
        width: 100%;
        flex-direction: row;
    }
`;
type Props = {
    children: React.ReactNode;
    tittel: React.ReactNode;
    href: string;
};

const InfoPanel = ({ children, tittel, href }: Props) => {
    return (
        <StyledLinkPanel href={href} border={false}>
            <LinkPanel.Title as="h3">{tittel}</LinkPanel.Title>
            <LinkPanel.Description>{children}</LinkPanel.Description>
        </StyledLinkPanel>
    );
};

export default InfoPanel;
