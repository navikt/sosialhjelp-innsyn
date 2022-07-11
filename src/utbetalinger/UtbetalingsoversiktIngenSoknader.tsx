import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import React from "react";
import {BodyShort, GuidePanel, Heading, LinkPanel} from "@navikt/ds-react";
import styled from "styled-components";

const StyledGuidePanel = styled(GuidePanel)`
    --navds-guide-panel-color-border: none;
    --navds-guide-panel-color-illustration-background: #cde7d8;
`;

const UtbetalingsoversiktIngenSoknader: React.FC = () => {
    return (
        <div className="soknadsOversiktSide ingenSakerFunnetPanelLuftOver">
            <StyledGuidePanel
                className="soknadsOversiktVeilederpanelIkon"
                poster
                illustration={<IngenSoknaderFunnet />}
            >
                <>
                    <Heading level="2" size="medium" spacing className="ingenSoknaderFunnetText">
                        Vi finner ingen utbetalinger for økonomisk sosialhjelp
                    </Heading>
                    <BodyShort className="ingenSoknaderFunnetText">
                        Dette kan være fordi du ikke har søkt digitalt.
                    </BodyShort>
                    <BodyShort className="ingenSoknaderFunnetText">
                        Vi kan desverre ikke vise utbetalinger for søknader som er sendt på papir.
                    </BodyShort>
                </>
            </StyledGuidePanel>

            <div className={"soknadsOversiktLenkePanel"}>
                <LinkPanel
                    className={"soknadsOversiktLenker"}
                    href={"https://www.nav.no/okonomisk-sosialhjelp"}
                    border={false}
                >
                    <div className={"soknadsOversiktLenkerAlign"}>
                        <LinkPanel.Title>Les mer om økonomisk sosialhjelp</LinkPanel.Title>
                    </div>
                </LinkPanel>
                <LinkPanel
                    className={"soknadsOversiktLenker"}
                    href={"https://www.nav.no/okonomisk-sosialhjelp#soknad"}
                    border={false}
                >
                    <div className={"soknadsOversiktLenkerAlign"}>
                        <LinkPanel.Title>Søk om økonomisk sosialhjelp</LinkPanel.Title>
                    </div>
                </LinkPanel>
            </div>
        </div>
    );
};

export default UtbetalingsoversiktIngenSoknader;
