import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import React from "react";
import {BodyLong, Heading, LinkPanel} from "@navikt/ds-react";
import {StyledGuidePanel, StyledGuidePanelContent} from "../styles/styledGuidePanel";
import {StyledLenkePanelWrapper} from "../styles/LenkePanelWrapper";
import styled from "styled-components";
import {useTranslation} from "next-i18next";

const Wrapper = styled.div`
    padding-top: 1rem;
    white-space: pre-line;
`;

const UtbetalingsoversiktIngenSoknader: React.FC = () => {
    const {t} = useTranslation();
    return (
        <Wrapper>
            <StyledGuidePanel poster illustration={<IngenSoknaderFunnet />}>
                <StyledGuidePanelContent>
                    <Heading level="2" size="medium" spacing>
                        {t("utbetalinger.ingen-utbetalinger.tittel")}
                    </Heading>
                    <BodyLong>{t("utbetalinger.ingen-utbetalinger.body")}</BodyLong>
                </StyledGuidePanelContent>
            </StyledGuidePanel>

            <StyledLenkePanelWrapper>
                <LinkPanel href={"https://www.nav.no/okonomisk-sosialhjelp"} border={false}>
                    <LinkPanel.Title>{t("lenke.les_mer")}</LinkPanel.Title>
                </LinkPanel>
                <LinkPanel href={"https://www.nav.no/sosialhjelp/soknad"} border={false}>
                    <LinkPanel.Title>{t("lenke.sok")}</LinkPanel.Title>
                </LinkPanel>
            </StyledLenkePanelWrapper>
        </Wrapper>
    );
};

export default UtbetalingsoversiktIngenSoknader;
