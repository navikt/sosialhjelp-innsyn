import React from "react";
import { BodyLong, Heading, LinkPanel } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import { StyledGuidePanel, StyledGuidePanelContent } from "../styles/styledGuidePanel";
import { StyledLenkePanelWrapper } from "../styles/LenkePanelWrapper";
import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";

const UtbetalingsoversiktIngenSoknader = () => {
    const { t } = useTranslation();
    return (
        <div className="pt-4 whitespace-pre-line pb-[40px] max-w-[50rem]">
            <StyledGuidePanel poster illustration={<IngenSoknaderFunnet />}>
                <StyledGuidePanelContent>
                    <Heading level="2" size="medium" spacing>
                        {t("utbetalinger.ingen-utbetalinger.tittel", { ns: "utbetalinger" })}
                    </Heading>
                    <BodyLong>{t("utbetalinger.ingen-utbetalinger.body", { ns: "utbetalinger" })}</BodyLong>
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
        </div>
    );
};

export default UtbetalingsoversiktIngenSoknader;
