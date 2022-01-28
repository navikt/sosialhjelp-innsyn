import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import React from "react";
import {BodyShort, GuidePanel, Heading} from "@navikt/ds-react";
import styled from "styled-components";

const StyledGuidePanel = styled(GuidePanel)`
    --navds-guide-panel-color-border: none;
    --navds-guide-panel-color-illustration-background: #cde7d8;
`;

const UtbetalingsoversiktIngenInnsyn: React.FC = () => {
    return (
        <div className="soknadsOversiktSide ingenSakerFunnetPanelLuftOver">
            <StyledGuidePanel
                className="soknadsOversiktVeilederpanelIkon"
                poster
                illustration={<IngenSoknaderFunnet />}
            >
                <>
                    <Heading level="2" size="medium" spacing className="ingenSoknaderFunnetText">
                        Vi kan ikke vise dine utbetalinger for øknomisk sosialhjelp
                    </Heading>
                    <BodyShort className="ingenSoknaderFunnetText" style={{margin: "0 3rem"}}>
                        Din kommune støtter foreløpig ikke denne visningen. Du kan se dine utbetalinger i brevet med
                        svar på søknaden din.
                    </BodyShort>
                </>
            </StyledGuidePanel>
        </div>
    );
};

export default UtbetalingsoversiktIngenInnsyn;
