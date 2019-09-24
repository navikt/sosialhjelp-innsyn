import {Panel} from "nav-frontend-paneler";
import {Normaltekst, Systemtittel, Element} from "nav-frontend-typografi";
import React from "react";
import DokumentBinder from "../ikoner/DocumentBinder";
import "./oppgaver.less";
import Lenke from "nav-frontend-lenker";
import {Hovedknapp} from "nav-frontend-knapper";
import {EkspanderbartpanelBase} from "nav-frontend-ekspanderbartpanel";
import OppgaveView from "./OppgaveView";
import {Fil, InnsynsdataSti, Oppgave } from "../../redux/innsynsdata/innsynsdataReducer";
import Lastestriper from "../lastestriper/Lasterstriper";
import {hentInnsynsdata } from "../../redux/innsynsdata/innsynsDataActions";
import {useDispatch } from "react-redux";

interface Props {
    oppgaver: null|Oppgave[];
    leserData?: boolean;
    soknadId?: any;
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

function genererMetatadataJson(oppgaver: null|Oppgave[]) {
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

const Oppgaver: React.FC<Props> = ({oppgaver, leserData, soknadId}) => {

    const dispatch = useDispatch();

    const sendVedlegg = (event: any) => {
        let formData  = new FormData();
        const metadataJson = genererMetatadataJson(oppgaver);
        const metadataBlob = new Blob([metadataJson], { type: 'application/json' });
        formData.append("files", metadataBlob, "metadata.json");
        oppgaver && oppgaver.map((oppgave: Oppgave) => {
            return oppgave.filer && oppgave.filer.map((fil: Fil) => {
                return formData.append("files", fil.file, fil.filnavn);
            });
        });

        // dispatch(lastOppVedlegg(fiksDigisosId, formData));

        const url = "http://localhost:8080/sosialhjelp/innsyn-api/api/v1/innsyn/1234/vedlegg/send";
        // dispatch(settRestStatus(sti, REST_STATUS.PENDING));
        fetch(url, {
            method: 'POST',
            body: formData,
            headers: new Headers({
                "Authorization": "Bearer 1234",
                "Accept": "*/*"
            })
        }).then((response: Response) => {
            console.log("TODO: Gjør noe med respons fra backend");
            console.warn(JSON.stringify(response.json(), null, 8));

            const fiksDigisosId: string = soknadId === undefined ? "1234" : soknadId;
            dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.OPPGAVER));
        });

        event.preventDefault()
    };

    // const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus);

    let innsendelsesfrist = foersteInnsendelsesfrist(oppgaver);
    return (
        <>
            {/*<pre>{JSON.stringify(restStatus.oppgaver, null, 8)}</pre>*/}
            <Panel className="panel-luft-over">
                {leserData && (
                    <Lastestriper linjer={1}/>
                )}
                {!leserData && (
                    <Systemtittel>Dine oppgaver</Systemtittel>
                )}
            </Panel>
            <Panel className="panel-glippe-over oppgaver_panel">

                {leserData && (
                    <Lastestriper linjer={1}/>
                )}

                {oppgaver && oppgaver.length === 0 && !leserData && (
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
                        <Normaltekst >
                            Veilederen trenger mer dokumentasjon for å behandle søknaden din.
                            Hvis du ikke leverer dokumentasjonen innen fristen, blir
                            søknaden behandlet med den informasjonen vi har.
                        </Normaltekst>
                        <Lenke href="./todo" className="luft_over_10px luft_under_1rem lenke_uten_ramme">Hjelp til å laste opp?</Lenke>

                        <div className="oppgaver_detaljer">
                            <Normaltekst className="luft_under_8px">Frist for innlevering er {innsendelsesfrist}</Normaltekst>
                            {oppgaver.map((oppgave: Oppgave, index: number) => (
                                <OppgaveView oppgave={oppgave} key={index} id={index}/>
                            ))}
                        </div>

                        <Hovedknapp
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
