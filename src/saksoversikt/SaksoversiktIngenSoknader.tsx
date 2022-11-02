import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import React from "react";
import {BodyShort, Heading, LinkPanel} from "@navikt/ds-react";
import styled from "styled-components";
import {StyledGuidePanel, StyledGuidePanelContent} from "../styles/styledGuidePanel";
import {StyledLenkePanelWrapper} from "../styles/LenkePanelWrapper";

const Wrapper = styled.div`
    padding-top: 1rem;
`;

const SaksoversiktIngenSoknader: React.FC = () => {
    return (
        <Wrapper>
            <StyledGuidePanel poster illustration={<IngenSoknaderFunnet />}>
                <StyledGuidePanelContent>
                    <Heading level="2" size="medium" spacing>
                        Vi finner ingen søknader fra deg
                    </Heading>
                    <BodyShort spacing>
                        Dette kan være fordi kommunen din ikke kan vise søknader sendt på papir, eller at søknaden din
                        er eldre enn 15 måneder.
                    </BodyShort>
                </StyledGuidePanelContent>
            </StyledGuidePanel>

            <StyledLenkePanelWrapper>
                <LinkPanel href={"https://www.nav.no/okonomisk-sosialhjelp"} border={false}>
                    <LinkPanel.Title>Les mer om økonomisk sosialhjelp</LinkPanel.Title>
                </LinkPanel>
                <LinkPanel href={"https://www.nav.no/sosialhjelp/soknad"} border={false}>
                    <LinkPanel.Title>Søk om økonomisk sosialhjelp</LinkPanel.Title>
                </LinkPanel>
            </StyledLenkePanelWrapper>
        </Wrapper>
    );
};

export default SaksoversiktIngenSoknader;
