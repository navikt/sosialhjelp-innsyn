import React from "react";
import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst, Sidetittel} from "nav-frontend-typografi";
import {getAbsoluteBasename} from "../../configureStore";
import {getApiBaseUrlForSwagger} from "../../utils/restUtils";
import Lenke from "nav-frontend-lenker";

const InnsynDemoMeny: React.FC = () => {
    return (
        <Panel>
            <Sidetittel>Sosialhjelp innsyn mock</Sidetittel>
            <Normaltekst>
                Innsyn for sosialsøkere. Data som vises er testdata fra backend.
            </Normaltekst>
            <br/>
            <ul className="typo-normal">
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/status"}>Status på sak</Lenke></li>
            </ul>
            <br />

            <Innholdstittel>Endre innsynsdata med swagger</Innholdstittel>
            <Normaltekst>
                For å teste innsynsløsning, kan man laste opp innsynsdata som JSON til API via swaggersidene slik:
            </Normaltekst>
            <br/>
            <ol className="typo-normal">
                <li>Gå til <Lenke href={ getApiBaseUrlForSwagger() }>swagger</Lenke></li>
                <li>Velg <b>mock-controller</b> og tilhørende POST-kall, og deretter <b>'Try it out'</b></li>
                <li>Lim inn dine testdata som jsonDigisosSoker (digisos-soker.json)</li>
                <li>Velg en 'soknadId' for dine testdata</li>
                <li>Gå til <Lenke href={"/" + getAbsoluteBasename() + "/innsyn/soknadId/status"}>status-siden</Lenke></li>
                <li>Endre 'soknadId' i url til å matche din soknadId fra steg 4 for å se innsynsvisningen med dine testdata</li>
            </ol>
            <br />

            <Innholdstittel>Statiske eksempler på innsynssider</Innholdstittel>
            <Normaltekst>
                Sider under utvikling med statiske mockdata.
            </Normaltekst>
            <br/>
            <ul className="typo-normal">
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/demo/sendt"}>Sendt søknad</Lenke></li>
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/demo/mottatt"}>Mottatt søknad</Lenke></li>
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/demo/behandling"}>Under behandling</Lenke></li>
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/demo/behandlet"}>Ferdig behandlet</Lenke></li>
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/demo/dineVedlegg"}>Vedlegg</Lenke></li>
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/demo/oppgaver"}>Oppgaver</Lenke></li>
            </ul>
            <br />
            <Innholdstittel>Digisos forside eksempler</Innholdstittel>
            <Normaltekst>
                Saksoversikt på Digisos forside for innloggede brukere.
            </Normaltekst>
            <br/>
            <ul className="typo-normal">
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/demo/saksoversikt"}>Dine saker: Bruker har sak</Lenke></li>
            </ul>
            <br/>

            <Innholdstittel>"Hva skjedde nå?" ekspempler</Innholdstittel>
            <ul className="typo-normal">
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/demo/vedtakEtterFerdigBehandlet"}>Vedtak etter ferdig behandlet</Lenke></li>
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/demo/blirIkkeRealitetsbehandlet"}>Blir ikke realitetsbehandlet</Lenke></li>
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/demo/kvalifiseringsprogram"}>Kvalifiseringsprogram</Lenke></li>
            </ul>
            <br/>

            <Innholdstittel>Utbetalingsoversikt</Innholdstittel>
            <ul className="typo-normal">
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/utbetalinger/demo"}>Dine utbetalinger</Lenke></li>
            </ul>
            <br/>

            <Innholdstittel>Interne testsider</Innholdstittel>
            <ul className="typo-normal">
                <li><Lenke href={"/" + getAbsoluteBasename() + "/innsyn/debug"}>Vis alle innsynsdata som JSON</Lenke></li>
            </ul>
            <br/>

        </Panel>
    )
};

export default InnsynDemoMeny;
