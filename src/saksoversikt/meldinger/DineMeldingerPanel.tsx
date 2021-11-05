import React from "react";
import Dialog from "../../components/ikoner/Dialog";
import {LinkPanel} from "@navikt/ds-react";
import styled from "styled-components";

const FlexContainer = styled.div`
    display: flex;
    column-gap: 1rem;
    align-items: center;
`;

const IconContainer = styled.div`
    width: 2rem;
`;

const DineMeldingerPanel: React.FC = () => {
    return (
        <LinkPanel href="/sosialhjelp/meldinger" border={false}>
            <FlexContainer>
                <IconContainer>
                    <Dialog />
                </IconContainer>
                <div>
                    <LinkPanel.Title>Dine meldinger</LinkPanel.Title>
                    <LinkPanel.Description>Meldinger mellom deg og veilederen din</LinkPanel.Description>
                </div>
            </FlexContainer>
        </LinkPanel>
    );
};

export default DineMeldingerPanel;
