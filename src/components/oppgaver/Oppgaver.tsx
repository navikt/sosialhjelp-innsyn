import {Panel} from "nav-frontend-paneler";
import {Element, Normaltekst, Systemtittel} from "nav-frontend-typografi";
import React from "react";
import DokumentBinder from "../ikoner/DocumentBinder";
import "./oppgaver.less";
import Lenke from "nav-frontend-lenker";
import {EkspanderbartpanelBase} from "nav-frontend-ekspanderbartpanel";
import OppgaveView from "./OppgaveView";
import {Oppgave} from "../../redux/innsynsdata/innsynsdataReducer";
import Lastestriper from "../lastestriper/Lasterstriper";
import TodoList from "../ikoner/TodoList";
import {FormattedMessage} from "react-intl";
import PaperClip from "../ikoner/PaperClip";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";
import VilkarView from "../vilkar/VilkarView";
import IngenOppgaverPanel from "./IngenOppgaverPanel";

interface Props {
    oppgaver: null | Oppgave[];
    leserData?: boolean;
}

function foersteInnsendelsesfrist(oppgaver: null | Oppgave[]): string {
    if (oppgaver === null) {
        return "";
    }
    let innsendelsesfrist: string = "";
    if (oppgaver.length > 0) {
        const innsendelsesfrister = oppgaver.map((oppgave: Oppgave) => new Date(oppgave.innsendelsesfrist!!));
        innsendelsesfrist = innsendelsesfrister[0].toLocaleDateString();
    }
    return innsendelsesfrist;
}

const Oppgaver: React.FC<Props> = ({oppgaver, leserData}) => {

    // TODO Gi bruker tilbakemelding om at filer holder på å bli lastet opp.
    // const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus);
    // console.log("restStatus: " + restStatus);
    // <pre>REST status: {JSON.stringify(restStatus.oppgaver, null, 8)}</pre>

    const brukerHarOppgaver: boolean = oppgaver !== null && oppgaver.length > 0;
    const oppgaverErFraInnsyn: boolean = brukerHarOppgaver && oppgaver!![0].oppgaveElementer!![0].erFraInnsyn;
    let innsendelsesfrist = oppgaverErFraInnsyn ? foersteInnsendelsesfrist(oppgaver) : null;

    return (
        <>
            <Panel className="panel-luft-over">
                {leserData && (
                    <Lastestriper linjer={1}/>
                )}
                {!leserData && (
                    <Systemtittel>
                        <FormattedMessage id="oppgaver.dine_oppgaver"/>
                    </Systemtittel>
                )}
            </Panel>

            <VilkarView/>


            {leserData && (
                <Panel
                    className={"panel-glippe-over oppgaver_panel " + (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")}
                >
                    <Lastestriper linjer={1}/>
                </Panel>
            )}


            <IngenOppgaverPanel leserData={leserData}/>

            {brukerHarOppgaver && (
                <Panel
                    className={"panel-glippe-over oppgaver_panel " + (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")}
                >
                    <EkspanderbartpanelBase apen={true} heading={(
                        <div className="oppgaver_header">
                            <DokumentBinder/>
                            <div>
                                <Element>
                                    {oppgaverErFraInnsyn && (
                                        <FormattedMessage id="oppgaver.maa_sende_dok_veileder"/>
                                    )}
                                    {!oppgaverErFraInnsyn && (
                                        <FormattedMessage id="oppgaver.maa_sende_dok"/>
                                    )}
                                </Element>
                                <Normaltekst>
                                    {oppgaverErFraInnsyn && (
                                        <FormattedMessage
                                            id="oppgaver.neste_frist"
                                            values={{innsendelsesfrist: innsendelsesfrist}}
                                        />
                                    )}

                                </Normaltekst>
                            </div>
                        </div>
                    )}>
                        {(oppgaverErFraInnsyn ? <Normaltekst>
                            <FormattedMessage id="oppgaver.veileder_trenger_mer"/>
                        </Normaltekst> : <Normaltekst>
                            <FormattedMessage id="oppgaver.last_opp_vedlegg_ikke"/>
                        </Normaltekst>)}
                        <Lenke
                            href="https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Teknisk+brukerstotte/hjelp-til-personbruker?kap=398773"
                            className="luft_over_10px luft_under_1rem lenke_uten_ramme"
                        >
                            <FormattedMessage id="oppgaver.hjelp_last_opp"/>
                        </Lenke>

                        <DriftsmeldingVedlegg/>

                        <div>
                            {oppgaver !== null && oppgaver.map((oppgave: Oppgave, index: number) => (
                                <OppgaveView oppgave={oppgave} key={index} oppgaverErFraInnsyn={oppgaverErFraInnsyn}
                                             oppgaveIndex={index}/>
                            ))}
                        </div>

                    </EkspanderbartpanelBase>
                </Panel>

            )}

        </>
    );
};

export default Oppgaver;
