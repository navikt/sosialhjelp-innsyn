import {Panel} from "nav-frontend-paneler";
import {Element, Normaltekst, Systemtittel} from "nav-frontend-typografi";
import React, {useState} from "react";
import DokumentBinder from "../ikoner/DocumentBinder";
import "./oppgaver.less";
import {EkspanderbartpanelBase} from "nav-frontend-ekspanderbartpanel";
import OppgaveView from "./OppgaveView";
import {
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    Oppgave,
    OppgaveElement,
    settRestStatus,
} from "../../redux/innsynsdata/innsynsdataReducer";
import Lastestriper from "../lastestriper/Lasterstriper";
import {FormattedMessage} from "react-intl";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";
import VilkarView from "../vilkar/VilkarView";
import IngenOppgaverPanel from "./IngenOppgaverPanel";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {fetchPost, REST_STATUS} from "../../utils/restUtils";
import {maxMengdeStorrelse, opprettFormDataMedVedleggFraOppgaver} from "../../utils/vedleggUtils";
import {
    hentInnsynsdata,
    innsynsdataUrl,
    setOppgaveVedleggopplastingFeilet,
    logErrorMessage,
} from "../../redux/innsynsdata/innsynsDataActions";
import {formatDato} from "../../utils/formatting";
import {OpplastingAvVedleggModal} from "./OpplastingAvVedleggModal";

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
        return 0;
    }
    let now = Math.floor(new Date().getTime() / (3600 * 24 * 1000)); //days as integer from..
    let frist = Math.floor(innsendelsesfrist.getTime() / (3600 * 24 * 1000)); //days as integer from..
    return now - frist;
}

function getAntallDagerTekst(antallDagerSidenFristBlePassert: number): string {
    return antallDagerSidenFristBlePassert > 1
        ? antallDagerSidenFristBlePassert + " dager"
        : antallDagerSidenFristBlePassert + " dag";
}

function harIkkeValgtFiler(oppgave: Oppgave | null) {
    let antall = 0;
    oppgave &&
        oppgave.oppgaveElementer.forEach((oppgaveElement: OppgaveElement) => {
            oppgaveElement.filer &&
                oppgaveElement.filer.forEach(() => {
                    antall += 1;
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
    const [sendVedleggButtonIndex, setSendVedleggButtonIndex] = useState<number>(-1);

    const sendVedlegg = (event: any, oppgaveIndex: number) => {
        setSendVedleggButtonIndex(-1);
        if (!oppgaver || !fiksDigisosId) {
            event.preventDefault();
            return;
        }

        let formData = opprettFormDataMedVedleggFraOppgaver(oppgaver[oppgaveIndex]);
        const sti: InnsynsdataSti = InnsynsdataSti.VEDLEGG;
        const path = innsynsdataUrl(fiksDigisosId, sti);
        setSendVedleggButtonIndex(oppgaveIndex);

        dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.PENDING));

        const ingenFilerValgt = harIkkeValgtFiler(oppgaver[oppgaveIndex]);
        dispatch(setOppgaveVedleggopplastingFeilet(ingenFilerValgt));

        //denne sjekker total sammensatt fil størrelse
        // dette funger, men foreløpig vises ikke en feilmelding
        function setterStorrelse(oppgaver: any) {
            let sammensattFilStorrelse = 0;
            oppgaver.forEach((oppgave: Oppgave) => {
                oppgave.oppgaveElementer.forEach((oppgaveElement: OppgaveElement) => {
                    if (oppgaveElement.filer) {
                        oppgaveElement.filer.forEach((file: Fil) => {
                            if (file.file?.size) {
                                sammensattFilStorrelse += file.file.size;
                            }
                        });
                    }
                });
            });
            return sammensattFilStorrelse;
        }

        const sammensattFilStorrelse: number = setterStorrelse(oppgaver);

        if (ingenFilerValgt) {
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            event.preventDefault();
            return;
        }

        if (sammensattFilStorrelse < maxMengdeStorrelse && sammensattFilStorrelse !== 0) {
            fetchPost(path, formData, "multipart/form-data")
                .then((filRespons: any) => {
                    let harFeil: boolean = false;
                    if (Array.isArray(filRespons)) {
                        filRespons.forEach((respons) => {
                            respons.filer.forEach((fil: Fil, index: number) => {
                                if (fil.status !== "OK") {
                                    harFeil = true;
                                }
                                dispatch({
                                    type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL,
                                    fil: {filnavn: fil.filnavn} as Fil,
                                    status: fil.status,
                                    innsendelsesfrist: respons.innsendelsesfrist,
                                    dokumenttype: respons.type,
                                    tilleggsinfo: respons.tilleggsinfo,
                                    vedleggIndex: index,
                                });
                            });
                        });
                    }
                    if (harFeil) {
                        dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
                    } else {
                        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.OPPGAVER));
                        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
                        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
                    }
                })
                .catch((e) => {
                    dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
                    logErrorMessage("Feil med opplasting av vedlegg: " + e.message);
                });
        } else {
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
        }
        event.preventDefault();
    };

    return (
        <>
            <Panel className="panel-luft-over">
                {leserData && <Lastestriper linjer={1} />}
                {!leserData && (
                    <Systemtittel>
                        <FormattedMessage id="oppgaver.dine_oppgaver" />
                    </Systemtittel>
                )}
            </Panel>

            <VilkarView />

            {leserData && (
                <Panel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
                    <Lastestriper linjer={1} />
                </Panel>
            )}

            <IngenOppgaverPanel leserData={leserData} />

            {brukerHarOppgaver && (
                <Panel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
                    <EkspanderbartpanelBase
                        heading={
                            <div className="oppgaver_header">
                                <DokumentBinder />
                                <div>
                                    <Element>
                                        {oppgaverErFraInnsyn && (
                                            <FormattedMessage id="oppgaver.maa_sende_dok_veileder" />
                                        )}
                                        {!oppgaverErFraInnsyn && <FormattedMessage id="oppgaver.maa_sende_dok" />}
                                    </Element>
                                    <Normaltekst>
                                        {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert <= 0 && (
                                            <FormattedMessage
                                                id="oppgaver.neste_frist"
                                                values={{
                                                    innsendelsesfrist:
                                                        innsendelsesfrist != null
                                                            ? formatDato(innsendelsesfrist.toISOString())
                                                            : "",
                                                }}
                                            />
                                        )}
                                        {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert > 0 && (
                                            <FormattedMessage
                                                id="oppgaver.neste_frist_passert"
                                                values={{
                                                    antall_dager: getAntallDagerTekst(antallDagerSidenFristBlePassert),
                                                    innsendelsesfrist:
                                                        innsendelsesfrist != null
                                                            ? formatDato(innsendelsesfrist!.toISOString())
                                                            : "",
                                                }}
                                            />
                                        )}
                                    </Normaltekst>
                                </div>
                            </div>
                        }
                    >
                        {oppgaverErFraInnsyn ? (
                            <Normaltekst>
                                <FormattedMessage id="oppgaver.veileder_trenger_mer" />
                            </Normaltekst>
                        ) : (
                            <Normaltekst>
                                <FormattedMessage id="oppgaver.last_opp_vedlegg_ikke" />
                            </Normaltekst>
                        )}

                        <OpplastingAvVedleggModal />

                        <DriftsmeldingVedlegg leserData={leserData} />

                        <div>
                            {oppgaver !== null &&
                                oppgaver.map((oppgave: Oppgave, oppgaveIndex: number) => (
                                    <OppgaveView
                                        oppgave={oppgave}
                                        key={oppgaveIndex}
                                        oppgaverErFraInnsyn={oppgaverErFraInnsyn}
                                        oppgaveIndex={oppgaveIndex}
                                        sendVedleggCallback={sendVedlegg}
                                        sendVedleggButtonIndex={sendVedleggButtonIndex}
                                    />
                                ))}
                        </div>
                    </EkspanderbartpanelBase>
                </Panel>
            )}
        </>
    );
};

export default Oppgaver;
