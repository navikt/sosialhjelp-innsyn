import React, {ChangeEvent, useState} from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import {
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    settRestStatus,
    KommuneResponse,
} from "../../redux/innsynsdata/innsynsdataReducer";
import FilView from "../oppgaver/FilView";
import UploadFileIcon from "../ikoner/UploadFile";
import Lenke from "nav-frontend-lenker";
import {FormattedMessage} from "react-intl";
import {Hovedknapp} from "nav-frontend-knapper";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {
    hentInnsynsdata,
    innsynsdataUrl,
    setOppgaveOpplastingFeiletPaBackend,
    setOppgaveOpplastingFeiletVirussjekkPaBackend,
} from "../../redux/innsynsdata/innsynsDataActions";
import {fetchPost, fetchPostGetErrors, REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import {
    opprettFormDataMedVedleggFraFiler,
    FilFeil,
    validerFilArrayForFeil,
    maxMengdeStorrelse,
} from "../../utils/vedleggUtils";
import {skrivFeilmelding, finnFilerMedFeil} from "../oppgaver/OppgaveView";
import {erOpplastingAvVedleggTillat} from "../driftsmelding/DriftsmeldingUtilities";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";
import {logWarningMessage, logInfoMessage} from "../../redux/innsynsdata/loggActions";
import Lastestriper from "../lastestriper/Lasterstriper";

function harFilermedFeil(filer: Fil[]) {
    return filer.find((it) => {
        return it.status !== "OK" && it.status !== "PENDING" && it.status !== "INITIALISERT";
    });
}
/*
 * Siden det er ikke noe form for oppgaveId så blir BACKEND_FEIL_ID
 * brukt sånnn at man slipper å lage egne actions
 * og reducere for denne ene komponenten.
 */
const BACKEND_FEIL_ID = "backendFeilId";

interface Props {
    restStatus: REST_STATUS;
}

const EttersendelseView: React.FC<Props> = ({restStatus}) => {
    const dispatch = useDispatch();
    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [listeMedFilerSomFeiler, setListeMedFilerSomFeiler] = useState<Array<FilFeil>>([]);
    const filer: Fil[] = useSelector((state: InnsynAppState) => state.innsynsdata.ettersendelse.filer);
    const vedleggKlarForOpplasting = filer.length > 0;
    const [sendVedleggTrykket, setSendVedleggTrykket] = useState<boolean>(false);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const otherVedleggLastesOpp =
        otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const listeOverVedleggIderSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletPaBackend
    );
    const listeOverOppgaveIderSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletIVirussjekkPaBackend
    );
    const opplastingFeilet = harFilermedFeil(filer);

    const onLinkClicked = (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        setSendVedleggTrykket(false);
        const uploadElement: any = document.getElementById("file_andre");
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (event: any) => {
        setListeMedFilerSomFeiler([]);
        const files: FileList | null = event.currentTarget.files;

        if (files) {
            const filerMedFeil: Array<FilFeil> = finnFilerMedFeil(files, 0);

            if (filerMedFeil.length === 0) {
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
                    if (!file) {
                        logInfoMessage("Tom fil ble forsøkt lagt til i EttersendelseView.onChange()");
                    } else {
                        dispatch({
                            type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_ETTERSENDELSE,
                            fil: {
                                filnavn: file.name,
                                status: "INITIALISERT",
                                file: file,
                            },
                        });
                    }
                }
            } else {
                setListeMedFilerSomFeiler(filerMedFeil);
            }
        }
        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    const sendVedlegg = (event: any) => {
        if (!fiksDigisosId) {
            event.preventDefault();
            return;
        }

        let formData = opprettFormDataMedVedleggFraFiler(filer);
        const sti: InnsynsdataSti = InnsynsdataSti.VEDLEGG;
        const path = innsynsdataUrl(fiksDigisosId, sti);
        dispatch(setOppgaveOpplastingFeiletPaBackend(BACKEND_FEIL_ID, false));
        dispatch(setOppgaveOpplastingFeiletVirussjekkPaBackend(BACKEND_FEIL_ID, false));

        setOverMaksStorrelse(false);

        const totaltSammensattFilStorrelse = filer?.reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
            0
        );

        setOverMaksStorrelse(totaltSammensattFilStorrelse > maxMengdeStorrelse);

        if (totaltSammensattFilStorrelse < maxMengdeStorrelse && totaltSammensattFilStorrelse !== 0) {
            dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.PENDING));

            fetchPost(path, formData, "multipart/form-data")
                .then((filRespons: any) => {
                    let harFeil: boolean = false;
                    let vedlegg = filRespons[0].filer;
                    if (Array.isArray(vedlegg)) {
                        for (let vedleggIndex = 0; vedleggIndex < vedlegg.length; vedleggIndex++) {
                            const fileItem = vedlegg[vedleggIndex];
                            if (fileItem.status !== "OK") {
                                harFeil = true;
                            }
                            dispatch({
                                type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_ETTERSENDELSESFIL,
                                fil: {filnavn: fileItem.filnavn} as Fil,
                                status: fileItem.status,
                                vedleggIndex: vedleggIndex,
                            });
                        }
                    }
                    if (harFeil) {
                        dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.FEILET));
                    } else {
                        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG, false));
                        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER, false));
                    }
                })
                .catch((e) => {
                    // Kjør feilet kall på nytt for å få tilgang til feilmelding i JSON data:
                    fetchPostGetErrors(path, formData, "multipart/form-data").then((errorResponse: any) => {
                        if (errorResponse.message === "Mulig virus funnet") {
                            dispatch(setOppgaveOpplastingFeiletPaBackend(BACKEND_FEIL_ID, false));
                            dispatch(setOppgaveOpplastingFeiletVirussjekkPaBackend(BACKEND_FEIL_ID, true));
                        }
                    });
                    dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.FEILET));
                    dispatch(setOppgaveOpplastingFeiletPaBackend(BACKEND_FEIL_ID, true));
                    logWarningMessage("Feil med opplasting av vedlegg: " + e.message, e.navCallId);
                });
        }
        event.preventDefault();
    };

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggTillat(kommuneResponse);

    const visDetaljeFeiler: boolean =
        opplastingFeilet !== undefined ||
        listeMedFilerSomFeiler.length > 0 ||
        (!vedleggKlarForOpplasting && sendVedleggTrykket) ||
        overMaksStorrelse ||
        listeOverVedleggIderSomFeiletPaBackend.includes(BACKEND_FEIL_ID) ||
        listeOverOppgaveIderSomFeiletIVirussjekkPaBackend.includes(BACKEND_FEIL_ID);

    return (
        <div>
            <DriftsmeldingVedlegg
                leserData={restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING}
            />

            {skalViseLastestripe(restStatus, true) ? (
                <Lastestriper linjer={1} />
            ) : (
                <div className={"oppgaver_detaljer " + (visDetaljeFeiler ? " oppgaver_detalj_feil_ramme" : "")}>
                    <div
                        className={
                            "oppgaver_detalj " +
                            (opplastingFeilet ||
                            listeMedFilerSomFeiler.length > 0 ||
                            (!vedleggKlarForOpplasting && sendVedleggTrykket)
                                ? " oppgaver_detalj_feil"
                                : "")
                        }
                        style={{marginTop: "0px"}}
                    >
                        <Element>
                            <FormattedMessage id="andre_vedlegg.type" />
                        </Element>
                        <Normaltekst className="luft_over_4px">
                            <FormattedMessage id="andre_vedlegg.tilleggsinfo" />
                        </Normaltekst>

                        {filer &&
                            filer.length > 0 &&
                            filer.map((fil: Fil, vedleggIndex: number) => (
                                <FilView
                                    key={vedleggIndex}
                                    fil={fil}
                                    vedleggIndex={vedleggIndex}
                                    oppgaveElementIndex={0}
                                    oppgaveIndex={0}
                                    setOverMaksStorrelse={setOverMaksStorrelse}
                                    oppgaveId={BACKEND_FEIL_ID}
                                />
                            ))}

                        {kanLasteOppVedlegg && (
                            <div className="oppgaver_last_opp_fil">
                                <UploadFileIcon
                                    className="last_opp_fil_ikon"
                                    onClick={(event: any) => {
                                        onLinkClicked(event);
                                    }}
                                />
                                <Lenke
                                    href="#"
                                    className="lenke_uten_ramme"
                                    onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                        onLinkClicked(event);
                                    }}
                                >
                                    <Element>
                                        <FormattedMessage id="vedlegg.velg_fil" />
                                    </Element>
                                </Lenke>
                                <input
                                    type="file"
                                    id={"file_andre"}
                                    multiple={true}
                                    onChange={(event: ChangeEvent) => {
                                        onChange(event);
                                    }}
                                    style={{display: "none"}}
                                />
                            </div>
                        )}
                        {validerFilArrayForFeil(listeMedFilerSomFeiler) && skrivFeilmelding(listeMedFilerSomFeiler, 0)}
                    </div>

                    <Hovedknapp
                        disabled={!kanLasteOppVedlegg || vedleggLastesOpp || otherVedleggLastesOpp}
                        spinner={vedleggLastesOpp}
                        type="hoved"
                        className="luft_over_1rem"
                        onClick={(event: any) => {
                            if (!vedleggKlarForOpplasting) {
                                setSendVedleggTrykket(true);
                                return;
                            }
                            sendVedlegg(event);
                        }}
                    >
                        <FormattedMessage id="andre_vedlegg.send_knapp_tittel" />
                    </Hovedknapp>
                </div>
            )}

            {listeOverVedleggIderSomFeiletPaBackend.includes(BACKEND_FEIL_ID) && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.opplasting_backend_feilmelding"} />
                </div>
            )}

            {listeOverOppgaveIderSomFeiletIVirussjekkPaBackend.includes(BACKEND_FEIL_ID) && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.opplasting_backend_virus_feilmelding"} />
                </div>
            )}

            {overMaksStorrelse && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.ulovlig_storrelse_av_alle_valgte_filer"} />
                </div>
            )}

            {(opplastingFeilet || (!vedleggKlarForOpplasting && sendVedleggTrykket)) && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage
                        id={opplastingFeilet ? "vedlegg.opplasting_feilmelding" : "vedlegg.minst_ett_vedlegg"}
                    />
                </div>
            )}
        </div>
    );
};

export default EttersendelseView;
