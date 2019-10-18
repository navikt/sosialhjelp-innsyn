import React from "react";
import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst, Sidetittel} from "nav-frontend-typografi";
import {getAbsoluteBasename} from "../../configureStore";
import {getApiBaseUrlForSwagger} from "../../utils/restUtils";
import Lenke from "nav-frontend-lenker";
import InternLenke from "../../components/internLenke/internLenke";

const InnsynDemoMeny: React.FC = () => {
    return (
        <Panel>
            <Sidetittel>Sosialhjelp innsyn</Sidetittel>
            <Normaltekst>
                Innsyn for sosialsøkere. Data som vises er testdata fra backend.
            </Normaltekst>
            <br/>

            <Innholdstittel>Logg inn som testbruker på innsyn</Innholdstittel>

            <ul>
                <li>
                    <Normaltekst>
                        <InternLenke href={"/innsyn/001/status"}>Beckett Brass</InternLenke>
                    </Normaltekst>
                </li>
                <li>
                    <Normaltekst>
                        <InternLenke href={"/innsyn/002/status"}>Nary Meha</InternLenke>
                    </Normaltekst>
                </li>
                <li>
                    <Normaltekst>
                        <InternLenke href={"/innsyn/003/status"}>Isareth Awakener</InternLenke>
                    </Normaltekst>
                </li>
            </ul>

            <br />

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

            <Innholdstittel>Statiske eksempler på innsynssider</Innholdstittel>
            <Normaltekst>
                Sider under utvikling med statiske mockdata.
            </Normaltekst>
            <br/>
            <ul className="typo-normal">
                <li><InternLenke href={"/innsyn/demo/sendt"}>Sendt søknad</InternLenke></li>
                <li><InternLenke href={"/innsyn/demo/mottatt"}>Mottatt søknad</InternLenke></li>
                <li><InternLenke href={"/innsyn/demo/behandling"}>Under behandling</InternLenke></li>
                <li><InternLenke href={"/innsyn/demo/behandlet"}>Ferdig behandlet</InternLenke></li>
                <li><InternLenke href={"/innsyn/demo/dineVedlegg"}>Vedlegg</InternLenke></li>
                <li><InternLenke href={"/innsyn/demo/oppgaver"}>Oppgaver</InternLenke></li>
            </ul>
            <br />
            <Innholdstittel>Digisos forside eksempler</Innholdstittel>
            <Normaltekst>
                Saksoversikt på Digisos forside for innloggede brukere.
            </Normaltekst>
            <br/>
            <ul className="typo-normal">
                <li><InternLenke href={"/innsyn/demo/saksoversikt"}>Dine saker: Bruker har sak</InternLenke></li>
            </ul>
            <br/>

            <Innholdstittel>"Hva skjedde nå?" eksempler</Innholdstittel>
            <ul className="typo-normal">
                <li><InternLenke href={"/innsyn/demo/vedtakEtterFerdigBehandlet"}>Vedtak etter ferdig behandlet</InternLenke></li>
                <li><InternLenke href={"/innsyn/demo/blirIkkeRealitetsbehandlet"}>Blir ikke realitetsbehandlet</InternLenke></li>
                <li><InternLenke href={"/innsyn/demo/kvalifiseringsprogram"}>Kvalifiseringsprogram</InternLenke></li>
            </ul>
            <br/>

            <Innholdstittel>Utbetalingsoversikt</Innholdstittel>
            <ul className="typo-normal">
                <li><InternLenke href={"/innsyn/utbetalinger/demo"}>Dine utbetalinger</InternLenke></li>
            </ul>
            <br/>

            <Innholdstittel>Interne testsider</Innholdstittel>
            <Normaltekst>
                Debugside med alle innsynsdata tilgjengelig fra frontend på JSON format.
            </Normaltekst>
            <ul className="typo-normal">
                <li>
                    <Normaltekst>
                        <InternLenke href={"/innsyn/001/debug"}>Beckett Brass</InternLenke>
                    </Normaltekst>
                </li>
                <li>
                    <Normaltekst>
                        <InternLenke href={"/innsyn/002/debug"}>Nary Meha</InternLenke>
                    </Normaltekst>
                </li>
                <li>
                    <Normaltekst>
                        <InternLenke href={"/innsyn/003/debug"}>Isareth Awakener</InternLenke>
                    </Normaltekst>
                </li>
            </ul>
            <br/>

        </Panel>
    )
};

export default InnsynDemoMeny;
