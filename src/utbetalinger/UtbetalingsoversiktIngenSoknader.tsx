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
                    <BodyLong>
                        Dette kan være fordi kommunen din ikke kan vise utbetalinger for søknader sendt på papir, eller
                        at utbetalingene er eldre enn 15 måneder.
                    </BodyLong>
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
