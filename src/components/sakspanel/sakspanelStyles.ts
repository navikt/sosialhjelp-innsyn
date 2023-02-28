import styled from "styled-components";
import {LinkPanel} from "@navikt/ds-react";
import {FileContent} from "@navikt/ds-icons";

export const StyledLinkPanelDescription = styled(LinkPanel.Description)`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
`;

export const StyledFileIcon = styled(FileContent).attrs({
    ariaHidden: true,
    title: "dokument",
})`
    margin-right: 1rem;
    @media screen and (max-width: 360px) {
        display: none;
    }
`;

export const StyledSaksDetaljer = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 900px) {
        flex-wrap: wrap;
    }
`;
