import {Panel} from "nav-frontend-paneler";
import {Normaltekst, Systemtittel, Element} from "nav-frontend-typografi";
import React from "react";
import DokumentBinder from "../ikoner/DocumentBinder";
import "./oppgaver.less";
import Lenke from "nav-frontend-lenker";
import {Hovedknapp} from "nav-frontend-knapper";
import {EkspanderbartpanelBase} from "nav-frontend-ekspanderbartpanel";
import OppgaveView from "./OppgaveView";
import {Oppgave} from "../../redux/innsynsdata/innsynsdataReducer";

interface Props {
    oppgaver: null|Oppgave[];
}

function foersteInnsendelsesfrist(oppgaver: null|Oppgave[]) {
    if (oppgaver === null) {
        return null;
    }
    let innsendelsesfrist: string = "";
    if (oppgaver.length > 0) {
        const innsendelsesfrister = oppgaver.map((oppgave: Oppgave) => new Date(oppgave.innsendelsesfrist)).sort();
        innsendelsesfrist = innsendelsesfrister[0].toLocaleDateString();
    }
    return innsendelsesfrist;
}

const Oppgaver: React.FC<Props> = ({oppgaver}) => {

    let innsendelsesfrist = foersteInnsendelsesfrist(oppgaver);

    return (
        <>
            <Panel className="panel-luft-over">
                <Systemtittel>Dine oppgaver</Systemtittel>
            </Panel>
            <Panel className="panel-glippe-over oppgaver_panel">

                {oppgaver && oppgaver.length === 0 && (
                    <Normaltekst>
                        Du har ingen oppgaver. Du vil få beskjed hvis det er noe du må gjøre.
                    </Normaltekst>
                )}

                {oppgaver && oppgaver.length > 0 && (
                    <EkspanderbartpanelBase apen={true} heading={(
                        <div className="oppgaver_header">
                            <DokumentBinder/>
                            <div>
                                <Element>Du må sende dokumentasjon til veileder</Element>
                                <Normaltekst>
                                    {oppgaver.length} vedlegg mangler
                                    <br/>
                                    Neste frist for innlevering er {innsendelsesfrist}
                                </Normaltekst>
                            </div>
                        </div>
                    )}>
                        <Normaltekst className="luft_over_1rem">
                            Veilederen trenger mer dokumentasjon for å behandle søknaden din.
                            Hvis du ikke leverer dokumentasjonen innen fristen, blir
                            søknaden behandlet med den informasjonen vi har.
                        </Normaltekst>

                        <Lenke href="./todo" className="luft_over_10px luft_under_1rem lenke_uten_ramme">Hjelp til å laste opp?</Lenke>

                        <div className="oppgaver_detaljer">
                            {oppgaver.map((oppgave: Oppgave, index: number) => (
                                <OppgaveView oppgave={oppgave} key={index} />
                            ))}
                        </div>

                        <Hovedknapp className="luft_over_2rem luft_under_1rem">
                            Send til veileder
                        </Hovedknapp>
                    </EkspanderbartpanelBase>

                )}

            </Panel>
        </>
    );
};

export default Oppgaver;
