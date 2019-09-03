import React from "react";
import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst, Sidetittel} from "nav-frontend-typografi";
import {getAbsoluteBasename} from "../configureStore";
import {getApiBaseUrlForSwagger} from "../utils/restUtils";

const InnsynTestMeny: React.FC = () => {
    return (
        <Panel>
            <Sidetittel>Sosialhjelp innsyn</Sidetittel>
            <Normaltekst>
                Her er det mulig å test innsyn for sosialsøkere.
            </Normaltekst>
            <ul className="typo-normal">
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/status"}>Status på sak</a> Dataene er default-response mock data fra bakcend.</li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/debug"}>Alle data som JSON</a></li>
            </ul>
            <br />

            <Innholdstittel>Swagger grensesnitt</Innholdstittel>
            <Normaltekst>
                Man kan bruke swaggersidene å laste opp testdata og vise testdataene i innsynssidene slik:
            </Normaltekst>
            <ol className="typo-normal">
                <li>Gå til <a href={ getApiBaseUrlForSwagger() }>swagger</a></li>
                <li>Velg <b>mock-controller</b> og tilhørende POST-kall, og deretter <b>'Try it out'</b></li>
                <li>Lim inn dine testdata som jsonDigisosSoker (digisos-soker.json)</li>
                <li>Velg en 'soknadId' for dine testdata</li>
                <li>Gå til <a href={"/" + getAbsoluteBasename() + "/innsyn/soknadId/status"}>status-siden</a></li>
                <li>Endre 'soknadId' i url til å matche din soknadId fra steg 4 for å se innsynsvisningen med dine testdata</li>
            </ol>
            <br />

            <Innholdstittel>Statiske eksempler på innsynssider</Innholdstittel>
            <Normaltekst>
                Sider under utvikling med statiske mockdata.
            </Normaltekst>
            <ul className="typo-normal">
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/sendt"}>Sendt søknad</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/mottatt"}>Mottatt søknad</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/behandling"}>Under behandling</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/behandlet"}>Ferdig behandlet</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/dineVedlegg"}>Vedlegg</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/oppgaver"}>Oppgaver</a></li>
            </ul>
            <br />
            <Innholdstittel>Statiske eksempler på saksoversikt</Innholdstittel>
            <Normaltekst>
                Sider under utvikling med statiske mockdata.
            </Normaltekst>
            <ul className="typo-normal">
                <li><a href={"/" + getAbsoluteBasename() + "/saksoversikt"}>Bruker har ingen søknader</a></li>
            </ul>
        </Panel>
    )
};

export default InnsynTestMeny;
