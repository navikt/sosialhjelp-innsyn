import React from "react";
import { BodyShort, Heading, LinkPanel } from "@navikt/ds-react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import { StyledGuidePanel, StyledGuidePanelContent } from "../styles/styledGuidePanel";
import { StyledLenkePanelWrapper } from "../styles/LenkePanelWrapper";
import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";

const Wrapper = styled.div`
    padding-top: 1rem;
`;

const SaksoversiktIngenSoknader = () => {
    const t = useTranslations("common");
    return (
        <Wrapper>
            <StyledGuidePanel poster illustration={<IngenSoknaderFunnet />}>
                <StyledGuidePanelContent>
                    <Heading level="2" size="medium" spacing>
                        {t("ingen_soknad.tittel")}
                    </Heading>
                    <BodyShort spacing>{t("ingen_soknad.info")}</BodyShort>
                </StyledGuidePanelContent>
            </StyledGuidePanel>

            <StyledLenkePanelWrapper>
                <LinkPanel href="https://www.nav.no/okonomisk-sosialhjelp" border={false}>
                    <LinkPanel.Title>{t("lenke.les_mer")}</LinkPanel.Title>
                </LinkPanel>
                <LinkPanel href="https://www.nav.no/sosialhjelp/soknad" border={false}>
                    <LinkPanel.Title>{t("lenke.sok")}</LinkPanel.Title>
                </LinkPanel>
            </StyledLenkePanelWrapper>
        </Wrapper>
    );
};

export default SaksoversiktIngenSoknader;
