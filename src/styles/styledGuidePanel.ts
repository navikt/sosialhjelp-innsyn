import styled from "styled-components";
import {GuidePanel} from "@navikt/ds-react";

export const StyledGuidePanel = styled(GuidePanel)`
    svg {
        height: 80%;
        width: 80%;
        margin-top: 0.5rem;
        margin-left: 1rem;
    }
`;

export const StyledGuidePanelContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
