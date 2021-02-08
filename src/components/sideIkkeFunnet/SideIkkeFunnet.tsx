import * as React from "react";
import UtropstegnSirkelGraIkon from "./UtropstegnSirkelGraIkon";
import {Innholdstittel} from "nav-frontend-typografi";
import "./SideIkkeFunnet.less";

const SideIkkeFunnet: React.FC<{}> = () => {
    return (
        <div className="sideIkkeFunnet skjema-content">
            <div className="sideIkkeFunnet__ikon">
                <UtropstegnSirkelGraIkon />
            </div>
            <Innholdstittel className="sideIkkeFunnet__tittel">OOPS, NOE GIKK GALT</Innholdstittel>
            <div className="sideIkkeFunnet__innhold">Vi fant ikke siden du prøvde å åpne</div>

            <ul className="sideIkkeFunnet__link-liste">
                <li className="sideIkkeFunnet__link">
                    <a href="http://www.nav.no" className="lenke">
                        Gå til forsiden nav.no
                    </a>
                </li>
                <li className="sideIkkeFunnet__link">
                    <a href="https://www.nav.no/no/Ditt+NAV" className="lenke">
                        Gå til Ditt NAV
                    </a>
                </li>
                <li className="sideIkkeFunnet__link">
                    <a
                        href="https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Klage+ris+og+ros/Feil+og+mangler+paa+navno"
                        className="lenke"
                    >
                        Meld fra om feil
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default SideIkkeFunnet;
