import Veilederpanel from "nav-frontend-veilederpanel";
import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import {Normaltekst, Systemtittel, Undertittel} from "nav-frontend-typografi";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import React from "react";

const SaksoversiktIngenSoknader: React.FC = () => {
    return (
        <div className="soknadsOversiktSide ingenSakerFunnetPanelLuftOver">
            <Veilederpanel
                veilederProps={{className: "soknadsOversiktVeilederpanelIkon"}}
                kompakt
                type={"plakat"}
                svg={<IngenSoknaderFunnet/>}
            >
                <>
                    <Systemtittel className="ingenSoknaderFunnetText">
                        Vi finner ingen digital søknad fra deg
                    </Systemtittel>
                    <Normaltekst className="ingenSoknaderFunnetText">
                        Vi kan dessverre ikke vise søknader som er sendt på papir.
                    </Normaltekst>
                </>
            </Veilederpanel>

            <div className={"soknadsOversiktLenkePanel"}>
                <LenkepanelBase className={"soknadsOversiktLenker"} href={"https://www.nav.no/sosialhjelp/"}>
                    <div className={"soknadsOversiktLenkerAlign"}>
                        <Undertittel className="lenkepanel__heading_ingen_soknader lenkepanelResenter">Les mer om økonomisk sosialhjelp</Undertittel>
                    </div>
                </LenkepanelBase>
                <LenkepanelBase className={"soknadsOversiktLenker"} href={"https://www.nav.no/sosialhjelp/slik-soker-du"}>
                    <div className={"soknadsOversiktLenkerAlign"}>
                        <Undertittel className="lenkepanel__heading_ingen_soknader lenkepanelResenter">Søk om økonomisk sosialhjelp</Undertittel>
                    </div>
                </LenkepanelBase>
            </div>
        </div>
    );
};

export default SaksoversiktIngenSoknader;