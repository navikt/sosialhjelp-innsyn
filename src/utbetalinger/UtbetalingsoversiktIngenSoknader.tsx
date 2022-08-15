import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import React from "react";
import {BodyLong, Heading, LinkPanel} from "@navikt/ds-react";
import {StyledGuidePanel, StyledGuidePanelContent} from "../styles/styledGuidePanel";
import {StyledLenkePanelWrapper} from "../styles/LenkePanelWrapper";
import styled from "styled-components";

const Wrapper = styled.div`
    padding-top: 1rem;
`;

const UtbetalingsoversiktIngenSoknader: React.FC = () => {
    return (
        <Wrapper>
            <StyledGuidePanel poster illustration={<IngenSoknaderFunnet />}>
                <StyledGuidePanelContent>
                    <Heading level="2" size="medium" spacing>
                        Vi finner ingen utbetalinger for økonomisk sosialhjelp
                    </Heading>
                    <BodyLong>Dette kan være fordi du ikke har søkt digitalt.</BodyLong>
                    <BodyLong>Vi kan desverre ikke vise utbetalinger for søknader som er sendt på papir.</BodyLong>
                </StyledGuidePanelContent>
            </StyledGuidePanel>

            <StyledLenkePanelWrapper>
                <LinkPanel href={"https://www.nav.no/okonomisk-sosialhjelp"} border={false}>
                    <LinkPanel.Title>Les mer om økonomisk sosialhjelp</LinkPanel.Title>
                </LinkPanel>
                <LinkPanel href={"https://www.nav.no/okonomisk-sosialhjelp#soknad"} border={false}>
                    <LinkPanel.Title>Søk om økonomisk sosialhjelp</LinkPanel.Title>
                </LinkPanel>
            </StyledLenkePanelWrapper>
        </Wrapper>
    );
};

export default UtbetalingsoversiktIngenSoknader;
