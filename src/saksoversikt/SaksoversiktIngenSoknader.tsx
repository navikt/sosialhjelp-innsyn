import Veilederpanel from "nav-frontend-veilederpanel";
import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import {Normaltekst, Systemtittel} from "nav-frontend-typografi";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import SlikSokerDu from "../components/ikoner/SlikSokerDu";
import DetteKanDuSokeOm from "../components/ikoner/DetteKanDuSokeOm";
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
                        Vi finner ingen digitale søknader fra deg
                    </Systemtittel>
                    <Normaltekst className="ingenSoknaderFunnetText">
                        Har du søkt på papir, har vi dessverre ikke mulighet til å vise den her.
                    </Normaltekst>
                </>
            </Veilederpanel>

            <div className={"soknadsOversiktLenkePanel"}>
                <LenkepanelBase className={"soknadsOversiktLenker"} href={"./slik-soker-du"}>
                    <div className={"soknadsOversiktLenkerAlign"}>
                        <SlikSokerDu/>
                        <Systemtittel className="lenkepanel__heading lenkepanelResenter">Slik søker du</Systemtittel>
                    </div>
                </LenkepanelBase>

                <LenkepanelBase className={"soknadsOversiktLenker"} href={"./dette-kan-du-soke-om"}>
                    <div className={"soknadsOversiktLenkerAlign"}>
                        <DetteKanDuSokeOm/>
                        <Systemtittel className="lenkepanel__heading lenkepanelResenter">Dette kan du søke om</Systemtittel>
                    </div>
                </LenkepanelBase>
            </div>
        </div>
    );
};

export default SaksoversiktIngenSoknader;