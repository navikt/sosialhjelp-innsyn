import React from "react";
import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst, Sidetittel} from "nav-frontend-typografi";
import {getAbsoluteBasename} from "../../configureStore";
import {getApiBaseUrlForSwagger} from "../../utils/restUtils";

const InnsynDemoMeny: React.FC = () => {
    return (
        <Panel>
            <Sidetittel>Sosialhjelp innsyn mock</Sidetittel>
            <Normaltekst>
                Innsyn for sosialsøkere. Data som vises er testdata fra backend.
            </Normaltekst>
            <br/>
            <ul className="typo-normal">
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/status"}>Status på sak</a></li>
            </ul>
            <br />

            <Innholdstittel>Endre innsynsdata med swagger</Innholdstittel>
            <Normaltekst>
                For å teste innsynsløsning, kan man laste opp innsynsdata som JSON til API via swaggersidene slik:
            </Normaltekst>
            <br/>
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
            <br/>
            <ul className="typo-normal">
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/demo/sendt"}>Sendt søknad</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/demo/mottatt"}>Mottatt søknad</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/demo/behandling"}>Under behandling</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/demo/behandlet"}>Ferdig behandlet</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/demo/dineVedlegg"}>Vedlegg</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/demo/oppgaver"}>Oppgaver</a></li>
            </ul>
            <br />
            <Innholdstittel>Digisos forside eksempler</Innholdstittel>
            <Normaltekst>
                Saksoversikt på Digisos forside for innloggede brukere.
            </Normaltekst>
            <br/>
            <ul className="typo-normal">
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/demo/saksoversikt"}>Dine saker: Bruker har sak</a></li>
            </ul>
            <br/>

            <Innholdstittel>"Hva skjedde nå?" ekspempler</Innholdstittel>
            <ul className="typo-normal">
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/demo/vedtakEtterFerdigBehandlet"}>Vedtak etter ferdig behandlet</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/demo/blirIkkeRealitetsbehandlet"}>Blir ikke realitetsbehandlet</a></li>
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/demo/kvalifiseringsprogram"}>Kvalifiseringsprogram</a></li>
            </ul>
            <br/>

            <Innholdstittel>Interne testsider</Innholdstittel>
            <ul className="typo-normal">
                <li><a href={"/" + getAbsoluteBasename() + "/innsyn/debug"}>Vis alle innsynsdata som JSON</a></li>
            </ul>
        </Panel>
    )
};

export default InnsynDemoMeny;
