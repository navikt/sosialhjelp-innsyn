import {Panel} from "nav-frontend-paneler";
import {Element, Normaltekst, Systemtittel} from "nav-frontend-typografi";
import React from "react";
import DokumentBinder from "../ikoner/DocumentBinder";
import "./oppgaver.less";
import Lenke from "nav-frontend-lenker";
import {EkspanderbartpanelBase} from "nav-frontend-ekspanderbartpanel";
import OppgaveView from "./OppgaveView";
import {
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti, KommuneResponse,
    Oppgave, OppgaveElement,
    settRestStatus
} from "../../redux/innsynsdata/innsynsdataReducer";
import Lastestriper from "../lastestriper/Lasterstriper";
import {FormattedMessage} from "react-intl";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";
import VilkarView from "../vilkar/VilkarView";
import IngenOppgaverPanel from "./IngenOppgaverPanel";
import {Hovedknapp} from "nav-frontend-knapper";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {fetchPost, REST_STATUS} from "../../utils/restUtils";
import {opprettFormDataMedVedleggFraOppgaver} from "../../utils/vedleggUtils";
import {
    hentInnsynsdata,
    innsynsdataUrl,
    setOppgaveVedleggopplastingFeilet,
    logErrorMessage
} from "../../redux/innsynsdata/innsynsDataActions";
import {erOpplastingAvVedleggEnabled} from "../driftsmelding/DriftsmeldingUtilities";
import {formatDato} from "../../utils/formatting";

interface Props {
    oppgaver: null | Oppgave[];
    leserData?: boolean;
}

function foersteInnsendelsesfrist(oppgaver: null | Oppgave[]): Date | null {
    if (oppgaver === null) {
        return null;
    }
    if (oppgaver.length > 0) {
        const innsendelsesfrister = oppgaver.map((oppgave: Oppgave) => new Date(oppgave.innsendelsesfrist!!));
        return innsendelsesfrister[0];
    }
    return null;
}

export function antallDagerEtterFrist(innsendelsesfrist: null | Date): number {
    if (innsendelsesfrist === null) {
        return 0
    }
    let now = Math.floor(new Date().getTime() / (3600 * 24 * 1000)); //days as integer from..
    let frist = Math.floor(innsendelsesfrist.getTime() / (3600 * 24 * 1000)); //days as integer from..
    return now - frist;
}

function getAntallDagerTekst(antallDagerSidenFristBlePassert: number): string {
    return (antallDagerSidenFristBlePassert > 1) ? antallDagerSidenFristBlePassert + " dager" : antallDagerSidenFristBlePassert + " dag";
}

function harIkkeValgtFiler(oppgaver: Oppgave[] | null) {
    let antall = 0;
    oppgaver && oppgaver.forEach((oppgave: Oppgave) => {
        oppgave && oppgave.oppgaveElementer.forEach((oppgaveElement: OppgaveElement) => {
            oppgaveElement.filer && oppgaveElement.filer.forEach(() => {
                antall += 1;
            });
        });
    });
    return antall === 0;
}

const Oppgaver: React.FC<Props> = ({oppgaver, leserData}) => {
    const dispatch = useDispatch();
    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const brukerHarOppgaver: boolean = oppgaver !== null && oppgaver.length > 0;
    const oppgaverErFraInnsyn: boolean = brukerHarOppgaver && oppgaver!![0].oppgaveElementer!![0].erFraInnsyn;
    let innsendelsesfrist = oppgaverErFraInnsyn ? foersteInnsendelsesfrist(oppgaver) : null;
    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(innsendelsesfrist);

    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const otherVedleggLastesOpp = otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;

    let kommuneResponse: KommuneResponse | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.kommune);
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggEnabled(kommuneResponse);

    const sendVedlegg = (event: any) => {
        if (!oppgaver || !fiksDigisosId) {
            event.preventDefault();
            return;
        }

        let formData = opprettFormDataMedVedleggFraOppgaver(oppgaver);
        const sti: InnsynsdataSti = InnsynsdataSti.VEDLEGG;
        const path = innsynsdataUrl(fiksDigisosId, sti);
        dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.PENDING));
        const harIkkeValgtNoenFiler = harIkkeValgtFiler(oppgaver);
        dispatch(setOppgaveVedleggopplastingFeilet(harIkkeValgtNoenFiler));

        if (harIkkeValgtNoenFiler) {
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            return;
        }
        fetchPost(path, formData, "multipart/form-data").then((filRespons: any) => {
            let harFeil: boolean = false;
            if (Array.isArray(filRespons)) {
                for (let oppgaveIndex = 0; oppgaveIndex < filRespons.length; oppgaveIndex++) {
                    for (let vedleggIndex = 0; vedleggIndex < filRespons[oppgaveIndex].filer.length; vedleggIndex++) {
                        const fileItem = filRespons[oppgaveIndex].filer[vedleggIndex];
                        if (fileItem.status !== "OK") {
                            harFeil = true;
                        }
                        dispatch({
                            type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL,
                            fil: {filnavn: fileItem.filnavn} as Fil,
                            status: fileItem.status,
                            innsendelsesfrist: filRespons[oppgaveIndex].innsendelsesfrist,
                            dokumenttype: filRespons[oppgaveIndex].type,
                            tilleggsinfo: filRespons[oppgaveIndex].tilleggsinfo,
                            vedleggIndex: vedleggIndex,
                        });
                    }
                }
            }
            if (harFeil) {
                dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            } else {
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.OPPGAVER));
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
            }
        }).catch((e) => {
            logErrorMessage("Feil med opplasting av vedlegg: " + e.message);
        });

        event.preventDefault()
    };

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
                                    {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert <= 0 && (
                                        <FormattedMessage
                                            id="oppgaver.neste_frist"
                                            values={{innsendelsesfrist: (innsendelsesfrist != null) ? formatDato(innsendelsesfrist.toISOString()) : ""}}
                                        />
                                    )}
                                    {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert > 0 && (
                                        <FormattedMessage
                                            id="oppgaver.neste_frist_passert"
                                            values={{
                                                antall_dager: getAntallDagerTekst(antallDagerSidenFristBlePassert),
                                                innsendelsesfrist: (innsendelsesfrist != null) ? formatDato(innsendelsesfrist!.toISOString()) : ""}}
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

                        <DriftsmeldingVedlegg leserData={leserData}/>

                        <div>
                            {oppgaver !== null && oppgaver.map((oppgave: Oppgave, index: number) => (
                                <OppgaveView oppgave={oppgave} key={index} oppgaverErFraInnsyn={oppgaverErFraInnsyn}
                                             oppgaveIndex={index}/>
                            ))}
                        </div>
                        { kanLasteOppVedlegg &&
                            <Hovedknapp
                                disabled={vedleggLastesOpp || otherVedleggLastesOpp}
                                spinner={vedleggLastesOpp}
                                type="hoved"
                                className="luft_over_1rem"
                                onClick={(event: any) => {
                                    sendVedlegg(event)
                                }}
                            >
                                <FormattedMessage id="oppgaver.send_knapp_tittel"/>
                            </Hovedknapp>
                        }

                    </EkspanderbartpanelBase>
                </Panel>

            )}

        </>
    );
};

export default Oppgaver;
