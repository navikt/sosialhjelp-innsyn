import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import React from "react";
import {BodyShort, GuidePanel, Heading, LinkPanel} from "@navikt/ds-react";
import styled from "styled-components";

const StyledGuidePanel = styled(GuidePanel)`
    --navds-guide-panel-color-border: none;
    --navds-guide-panel-color-illustration-background: #cde7d8;
`;

const SaksoversiktIngenSoknader: React.FC = () => {
    return (
        <div className="soknadsOversiktSide ingenSakerFunnetPanelLuftOver">
            <StyledGuidePanel
                className="soknadsOversiktVeilederpanelIkon"
                poster
                illustration={<IngenSoknaderFunnet />}
            >
                <>
                    <Heading level="2" size="medium" spacing className="ingenSoknaderFunnetText">
                        Vi finner ingen digital søknad fra deg
                    </Heading>
                    <BodyShort spacing className="ingenSoknaderFunnetText">
                        Vi kan dessverre ikke vise søknader som er sendt på papir.
                    </BodyShort>
                </>
            </StyledGuidePanel>

            <div className={"soknadsOversiktLenkePanel"}>
                <LinkPanel className={"soknadsOversiktLenker"} href={"https://www.nav.no/sosialhjelp/"} border={false}>
                    <div className={"soknadsOversiktLenkerAlign"}>
                        <LinkPanel.Title>Les mer om økonomisk sosialhjelp</LinkPanel.Title>
                    </div>
                </LinkPanel>
                <LinkPanel
                    className={"soknadsOversiktLenker"}
                    href={"https://www.nav.no/sosialhjelp/slik-soker-du"}
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

export default SaksoversiktIngenSoknader;
