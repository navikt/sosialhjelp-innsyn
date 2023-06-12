import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import React from "react";
import {BodyShort, Heading, LinkPanel} from "@navikt/ds-react";
import styled from "styled-components";
import {StyledGuidePanel, StyledGuidePanelContent} from "../styles/styledGuidePanel";
import {StyledLenkePanelWrapper} from "../styles/LenkePanelWrapper";
import {useTranslation} from "react-i18next";

const Wrapper = styled.div`
    padding-top: 1rem;
`;

const SaksoversiktIngenSoknader: React.FC = () => {
    const {t} = useTranslation();

    return (
        <Wrapper>
            <StyledGuidePanel poster illustration={<IngenSoknaderFunnet />}>
                <StyledGuidePanelContent>
                    <Heading level="2" size="medium" spacing>
                        {t("ingenSoknad")}
                    </Heading>
                    <BodyShort spacing>{t("ingenSoknad.ingress")}</BodyShort>
                </StyledGuidePanelContent>
            </StyledGuidePanel>

            <StyledLenkePanelWrapper>
                <LinkPanel href={"https://www.nav.no/okonomisk-sosialhjelp"} border={false}>
                    <LinkPanel.Title>{t("lesMer")}</LinkPanel.Title>
                </LinkPanel>
                <LinkPanel href={"https://www.nav.no/sosialhjelp/soknad"} border={false}>
                    <LinkPanel.Title>{t("sok")}</LinkPanel.Title>
                </LinkPanel>
            </StyledLenkePanelWrapper>
        </Wrapper>
    );
};

export default SaksoversiktIngenSoknader;
