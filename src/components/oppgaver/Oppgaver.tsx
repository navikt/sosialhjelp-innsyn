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
import {hentInnsynsdata, innsynssdataUrl} from "../../redux/innsynsdata/innsynsDataActions";
import {useDispatch} from "react-redux";
import {getApiBaseUrl, fetchPost, getHeaders, REST_STATUS} from "../../utils/restUtils";
import TodoList from "../ikoner/TodoList";

interface Props {
    oppgaver: null | Oppgave[];
    leserData?: boolean;
    soknadId?: any;
}

function foersteInnsendelsesfrist(oppgaver: null | Oppgave[]): string {
    if (oppgaver === null) {
        return "";
    }
    let innsendelsesfrist: string = "";
    if (oppgaver.length > 0) {
        const innsendelsesfrister = oppgaver.map((oppgave: Oppgave) => new Date(oppgave.innsendelsesfrist!!)).sort();
        innsendelsesfrist = innsendelsesfrister[0].toLocaleDateString();
    }
    return innsendelsesfrist;
}

function genererMetatadataJson(oppgaver: null | Oppgave[]) {
    let metadata: any[] = [];
    oppgaver && oppgaver.map((oppgave: Oppgave) => {
        let filnavnArr: any[] = [];
        if (oppgave.filer && oppgave.filer) {
            filnavnArr = oppgave.filer.map((fil: any) => {
                return {filnavn: fil.filnavn}
            });
            metadata.push({
                type: oppgave.dokumenttype,
                tilleggsinfo: oppgave.tilleggsinformasjon,
                filer: filnavnArr
            })
        }
        return null;
    });
    const metadata_json: string = JSON.stringify(metadata, null, 8);
    return metadata_json;
}

function opprettFormDataMedVedlegg(oppgaver: Oppgave[]) {
    let formData = new FormData();
    const metadataJson = genererMetatadataJson(oppgaver);
    const metadataBlob = new Blob([metadataJson], {type: 'application/json'});
    formData.append("files", metadataBlob, "metadata.json");
    oppgaver && oppgaver.map((oppgave: Oppgave) => {
        return oppgave.filer && oppgave.filer.map((fil: Fil) => {
            return formData.append("files", fil.file, fil.filnavn);
        });
    });
    return formData;
}

function antallVedlegg(oppgaver: Oppgave[]) {
    let antall = 0;
    oppgaver && oppgaver.map((oppgave: Oppgave) => {
        return oppgave.filer && oppgave.filer.map((fil: Fil) => {
            return antall += 1;
        });
    });
    return antall;
}

const Oppgaver: React.FC<Props> = ({oppgaver, leserData, soknadId}) => {

    const dispatch = useDispatch();

    const sendVedlegg = (event: any) => {
        if (oppgaver === null) {
            event.preventDefault();
            return;
        }

        let formData = opprettFormDataMedVedlegg(oppgaver);
        const fiksDigisosId: string = soknadId === undefined ? "1234" : soknadId;
        const sti: InnsynsdataSti = InnsynsdataSti.SEND_VEDLEGG;
        const path = innsynssdataUrl(fiksDigisosId, sti);
        dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.PENDING));

        fetchPost(path, formData).then((filRespons: any) => {
            let harFeil: boolean = false;
            if (Array.isArray(filRespons)) {
                for (var index = 0; index < filRespons.length; index++) {
                    const fileItem = filRespons[index];
                    if (fileItem.status !== "OK") {
                        harFeil = true;
                    }
                    dispatch({
                        type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL,
                        filnavn: fileItem.filnavn,
                        status: fileItem.status
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
                    <Systemtittel>Dine oppgaver</Systemtittel>
                )}
            </Panel>
            <Panel
                className={"panel-glippe-over oppgaver_panel " + (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")}>

                {leserData && (
                    <Lastestriper linjer={1}/>
                )}

                {!brukerHarOppgaver && !leserData && (
                    <>
                        <span style={{float: "left", marginTop: "6px"}}>
                            <TodoList/>
                        </span>
                        <div style={{paddingLeft: "38px"}}>
                            <Element>Du har ingen oppgaver.</Element>
                            <Normaltekst>
                                Du vil få beskjed hvis det er noe du må gjøre.
                            </Normaltekst>
                        </div>
                    </>
                )}

                {brukerHarOppgaver && (
                    <EkspanderbartpanelBase apen={true} heading={(
                        <div className="oppgaver_header">
                            <DokumentBinder/>
                            <div>
                                <Element>{(oppgaverErFraInnsyn ? "Du må sende dokumentasjon til veileder" : "Du må sende inn dokumentasjon")}</Element>
                                <Normaltekst>
                                    {oppgaver !== null && oppgaver.length} vedlegg mangler
                                    <br/>
                                    {oppgaverErFraInnsyn && ("Neste frist for innlevering er " + innsendelsesfrist)}
                                </Normaltekst>
                            </div>
                        </div>
                    )}>
                        {(oppgaverErFraInnsyn ? <Normaltekst>
                            Veilederen trenger mer dokumentasjon for å behandle søknaden din.
                            Hvis du ikke leverer dokumentasjonen innen fristen, blir
                            søknaden behandlet med den informasjonen vi har.
                        </Normaltekst> : <Normaltekst>
                            Last opp vedlegg du ikke lastet opp da du sendte søknaden.
                            Vi anbefaler at du ettersender vedlegg så snart som mulig og helst innen 14 dager.
                            Hvis du ikke leverer dokumentasjonen, blir søknaden behandlet med den informasjonen vi
                            har.
                        </Normaltekst>)}
                        <Lenke href="./todo" className="luft_over_10px luft_under_1rem lenke_uten_ramme">Hjelp til å
                            laste opp?</Lenke>

                        <div className="oppgaver_detaljer">
                            {oppgaverErFraInnsyn && (
                                <Normaltekst className="luft_under_8px">Frist for innlevering
                                    er {innsendelsesfrist}</Normaltekst>
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
                            Send til veileder
                        </Hovedknapp>
                    </EkspanderbartpanelBase>

                )}

            </Panel>
        </>
    );
};

export default Oppgaver;
