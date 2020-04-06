import React from "react";
import Panel from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst, Sidetittel} from "nav-frontend-typografi";
import {getAbsoluteBasename} from "../../configureStore";
import {getApiBaseUrlForSwagger} from "../../utils/restUtils";
import Lenke from "nav-frontend-lenker";

const InnsynDemoMeny: React.FC = () => {
    return (
        <Panel>
            <Sidetittel>Sosialhjelp innsyn</Sidetittel>
            <Normaltekst>
                Innsyn for sosialsøkere. Data som vises er testdata fra backend.
            </Normaltekst>
            <br/>

            <Innholdstittel>Endre innsynsdata med swagger</Innholdstittel>
            <Normaltekst>
                For å teste innsynsløsning, kan man laste opp innsynsdata som JSON til API via swaggersidene slik:
            </Normaltekst>
            <br/>
            <ol className="typo-normal">
                <li>Gå til <Lenke href={ getApiBaseUrlForSwagger() }>swagger</Lenke></li>
                <li>Velg <b>digisos-api-controller</b> og tilhørende POST-kall, og deretter <b>'Try it out'</b></li>
                <li>Lim inn dine testdata som jsonDigisosSoker (digisos-soker.json)</li>
                <li>Velg en 'soknadId' for dine testdata</li>
                <li>Gå til <Lenke href={"/" + getAbsoluteBasename() + "/innsyn/soknadId/status"}>status-siden</Lenke></li>
                <li>Endre 'soknadId' i url til å matche din soknadId fra steg 4 for å se innsynsvisningen med dine testdata</li>
            </ol>
            <br />

        </Panel>
    )
};

export default InnsynDemoMeny;
