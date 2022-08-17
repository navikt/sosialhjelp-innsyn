import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import React from "react";
import {BodyLong, Heading} from "@navikt/ds-react";
import {StyledGuidePanel} from "../styles/styledGuidePanel";
import styled from "styled-components";

const StyledGuidePanelContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 3rem;
`;

const Wrapper = styled.div`
    padding-top: 1rem;
`;

const UtbetalingsoversiktIngenInnsyn: React.FC = () => {
    return (
        <Wrapper>
            <StyledGuidePanel poster illustration={<IngenSoknaderFunnet />}>
                <StyledGuidePanelContent>
                    <Heading level="2" size="medium" spacing>
                        Vi kan ikke vise dine utbetalinger for øknomisk sosialhjelp
                    </Heading>
                    <BodyLong>
                        Oversikten over utbetalinger for økonomisk sosialhjelp er dessverre ikke tilgjengelig i alle
                        kommuner. Du kan se dine utbetalinger i brevet med svar på søknaden din.
                    </BodyLong>
                </StyledGuidePanelContent>
            </StyledGuidePanel>
        </Wrapper>
    );
};

export default UtbetalingsoversiktIngenInnsyn;
