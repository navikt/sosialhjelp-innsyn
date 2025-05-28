import React from "react";
import { BodyLong, Heading, LinkPanel } from "@navikt/ds-react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import { StyledGuidePanel, StyledGuidePanelContent } from "../styles/styledGuidePanel";
import { StyledLenkePanelWrapper } from "../styles/LenkePanelWrapper";
import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    white-space: pre-line;
    min-height: 40vh;
    max-width: 50rem;
    margin: auto;
`;

const UtbetalingsoversiktIngenSoknader = () => {
    const t = useTranslations();
    return (
        <Wrapper>
            <StyledGuidePanel poster illustration={<IngenSoknaderFunnet />}>
                <StyledGuidePanelContent>
                    <Heading level="2" size="medium" spacing>
                        {t("utbetalinger.utbetalinger.ingen-utbetalinger.tittel")}
                    </Heading>
                    <BodyLong>{t("utbetalinger.utbetalinger.ingen-utbetalinger.body")}</BodyLong>
                </StyledGuidePanelContent>
            </StyledGuidePanel>

            <StyledLenkePanelWrapper>
                <LinkPanel href="https://www.nav.no/okonomisk-sosialhjelp" border={false}>
                    <LinkPanel.Title>{t("common.lenke.les_mer")}</LinkPanel.Title>
                </LinkPanel>
                <LinkPanel href="https://www.nav.no/sosialhjelp/soknad" border={false}>
                    <LinkPanel.Title>{t("common.lenke.sok")}</LinkPanel.Title>
                </LinkPanel>
            </StyledLenkePanelWrapper>
        </Wrapper>
    );
};

export default UtbetalingsoversiktIngenSoknader;
