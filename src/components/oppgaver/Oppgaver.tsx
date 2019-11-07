import {Panel} from "nav-frontend-paneler";
import {Normaltekst, Systemtittel, Element} from "nav-frontend-typografi";
import React from "react";
import DokumentBinder from "../ikoner/DocumentBinder";
import "./oppgaver.less";
import Lenke from "nav-frontend-lenker";
import {Hovedknapp} from "nav-frontend-knapper";
import {EkspanderbartpanelBase} from "nav-frontend-ekspanderbartpanel";
import OppgaveView from "./OppgaveView";
import {
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    Oppgave,
    settRestStatus
} from "../../redux/innsynsdata/innsynsdataReducer";
import Lastestriper from "../lastestriper/Lasterstriper";
import {hentInnsynsdata, innsynsdataUrl} from "../../redux/innsynsdata/innsynsDataActions";
import {useDispatch, useSelector} from "react-redux";
import {fetchPost, REST_STATUS} from "../../utils/restUtils";
import TodoList from "../ikoner/TodoList";
import {FormattedMessage} from "react-intl";
import PaperClip from "../ikoner/PaperClip";
import {InnsynAppState} from "../../redux/reduxTypes";
import {opprettFormDataMedVedleggFraOppgaver} from "../../utils/vedleggUtils";

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
        const innsendelsesfrister = oppgaver.map((oppgave: Oppgave) => new Date(oppgave.innsendelsesfrist!!)).sort();
        innsendelsesfrist = innsendelsesfrister[0].toLocaleDateString().replace("/",".");
    }
    return innsendelsesfrist;
}

function antallVedlegg(oppgaver: Oppgave[]) {
    let antall = 0;
    oppgaver && oppgaver.forEach((oppgave: Oppgave) => {
        oppgave.filer && oppgave.filer.forEach((fil: Fil) => {
            antall += 1;
        });
    });
    return antall;
}

const Oppgaver: React.FC<Props> = ({oppgaver, leserData}) => {

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);
    const dispatch = useDispatch();

    const sendVedlegg = (event: any) => {
        if (oppgaver === null || !fiksDigisosId) {
            event.preventDefault();
            return;
        }

        let formData = opprettFormDataMedVedleggFraOppgaver(oppgaver);
        const sti: InnsynsdataSti = InnsynsdataSti.SEND_VEDLEGG;
        const path = innsynsdataUrl(fiksDigisosId, sti);
        dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.PENDING));

        fetchPost(path, formData, "multipart/form-data").then((filRespons: any) => {
            let harFeil: boolean = false;
            if (Array.isArray(filRespons)) {
                for (var index = 0; index < filRespons.length; index++) {
                    const fileItem = filRespons[index];
                    if (fileItem.status !== "OK") {
                        harFeil = true;
                    }
                    dispatch({
                        type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL,
                        fil: {
                            filnavn: fileItem.filnavn,
                            status: fileItem.status,
                        } as Fil,
                    });
                }
            }
            if (!harFeil) {
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.OPPGAVER));
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
            }
        }).catch((reason: any) => {
            console.log("Feil med opplasting av vedlegg");
        });

        event.preventDefault()
    };

    // TODO Gi bruker tilbakemelding om at filer holder på å bli lastet opp.
    // const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus);
    // console.log("restStatus: " + restStatus);
    // <pre>REST status: {JSON.stringify(restStatus.oppgaver, null, 8)}</pre>

    const brukerHarOppgaver: boolean = oppgaver !== null && oppgaver.length > 0;
    const oppgaverErFraInnsyn: boolean = brukerHarOppgaver && oppgaver!![0].erFraInnsyn;
    let innsendelsesfrist = oppgaverErFraInnsyn ? foersteInnsendelsesfrist(oppgaver) : null;
    const vedleggKlarForOpplasting = oppgaver !== null && antallVedlegg(oppgaver) > 0;

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
            <Panel
                className={"panel-glippe-over oppgaver_panel " + (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")}>

                {leserData && (
                    <Lastestriper linjer={1}/>
                )}

                {!brukerHarOppgaver && !leserData && (
                    <>
                        <div>
                            <span style={{float: "left", marginTop: "6px"}}>
                                <TodoList/>
                            </span>
                            <div style={{paddingLeft: "38px"}}>
                                <Element>
                                    <FormattedMessage id="oppgaver.ingen_oppgaver"/>
                                </Element>
                                <Normaltekst>
                                    <FormattedMessage id="oppgaver.beskjed"/>
                                </Normaltekst>
                            </div>
                        </div>
                        <div style={{marginTop: "20px"}}>
                            <span style={{float: "left", marginTop: "6px"}}>
                                <PaperClip/>
                            </span>
                            <div style={{paddingLeft: "38px"}}>
                                <Element>
                                    <FormattedMessage id="oppgaver.andre_dokumenter"/>
                                </Element>
                                <Normaltekst>
                                    <FormattedMessage id="oppgaver.andre_dokumenter_beskjed"/>
                                </Normaltekst>
                            </div>
                        </div>
                    </>
                )}

                {brukerHarOppgaver && (
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
                                    {oppgaver !== null && oppgaver.length && (
                                        <FormattedMessage id="oppgaver.vedlegg_mangler"
                                                          values={{antall: oppgaver ? oppgaver.length : 0}}/>
                                    )}
                                    <br/>
                                    {oppgaverErFraInnsyn && (
                                        <FormattedMessage
                                            id="oppgaver.innsendelsesfrist"
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

                        <div className="oppgaver_detaljer">
                            {oppgaverErFraInnsyn && (
                                <Normaltekst className="luft_under_8px">
                                    <FormattedMessage
                                        id="oppgaver.neste_frist"
                                        values={{innsendelsesfrist: innsendelsesfrist}}
                                    />
                                </Normaltekst>
                            )}
                            {oppgaver !== null && oppgaver.map((oppgave: Oppgave, index: number) => (
                                <OppgaveView oppgave={oppgave} key={index} id={index}/>
                            ))}
                        </div>

                        <Hovedknapp
                            disabled={!vedleggKlarForOpplasting}
                            type="hoved"
                            className="luft_over_2rem luft_under_1rem"
                            onClick={(event: any) => sendVedlegg(event)}
                        >
                            <FormattedMessage id="oppgaver.send_knapp_tittel"/>

                        </Hovedknapp>
                    </EkspanderbartpanelBase>

                )}

            </Panel>
        </>
    );
};

export default Oppgaver;
