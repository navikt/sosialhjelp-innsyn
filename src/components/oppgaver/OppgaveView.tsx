import React, {useEffect, useState} from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import UploadFileIcon from "../ikoner/UploadFile";
import {
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    KommuneResponse,
    Oppgave,
    OppgaveElement,
    settRestStatus,
} from "../../redux/innsynsdata/innsynsdataReducer";
import FilView from "./FilView";
import {useDispatch, useSelector} from "react-redux";
import {OriginalSoknadVedleggType} from "../../redux/soknadsdata/vedleggTypes";
import {originalSoknadVedleggTekstVisning} from "../../redux/soknadsdata/vedleggskravVisningConfig";
import {FormattedMessage} from "react-intl";
import {InnsynAppState} from "../../redux/reduxTypes";
import {erOpplastingAvVedleggTillat} from "../driftsmelding/DriftsmeldingUtilities";
import {
    hentInnsynsdata,
    innsynsdataUrl,
    setOppgaveVedleggopplastingFeilet,
    hentOppgaveMedId,
    setOppgaveOpplastingFeilet,
    setOppgaveOpplastingFeiletPaBackend,
    setOppgaveOpplastingFeiletVirussjekkPaBackend,
} from "../../redux/innsynsdata/innsynsDataActions";
import {antallDagerEtterFrist} from "./Oppgaver";
import {formatDato} from "../../utils/formatting";
import {
    containsUlovligeTegn,
    legalCombinedFilesSize,
    legalFileSize,
    legalFileExtension,
    FilFeil,
    validerFilArrayForFeil,
    opprettFormDataMedVedleggFraOppgaver,
    maxMengdeStorrelse,
} from "../../utils/vedleggUtils";
import {Flatknapp, Hovedknapp} from "nav-frontend-knapper";
import {fetchPost, fetchPostGetErrors, REST_STATUS} from "../../utils/restUtils";
import {logWarningMessage, logInfoMessage} from "../../redux/innsynsdata/loggActions";
import {SkjemaelementFeilmelding} from "nav-frontend-skjema";

interface Props {
    oppgave: Oppgave;
    oppgaverErFraInnsyn: boolean;
    oppgaveIndex: any;
}

type ChangeEvent = React.FormEvent<HTMLInputElement>;

export const getVisningstekster = (type: string, tilleggsinfo: string | undefined) => {
    let typeTekst,
        tilleggsinfoTekst,
        sammensattType = type + "|" + tilleggsinfo,
        erOriginalSoknadVedleggType = Object.values(OriginalSoknadVedleggType).some((val) => val === sammensattType);

    if (erOriginalSoknadVedleggType) {
        let soknadVedleggSpec = originalSoknadVedleggTekstVisning.find((spc) => spc.type === sammensattType)!!;
        typeTekst = soknadVedleggSpec.tittel;
        tilleggsinfoTekst = soknadVedleggSpec.tilleggsinfo;
    } else {
        typeTekst = type;
        tilleggsinfoTekst = tilleggsinfo;
    }
    return {typeTekst, tilleggsinfoTekst};
};

const harFilerMedFeil = (oppgaveElementer: OppgaveElement[]) => {
    return oppgaveElementer.find((oppgaveElement) => {
        return !oppgaveElement.filer
            ? false
            : oppgaveElement.filer.find((it) => {
                  return it.status !== "OK" && it.status !== "PENDING" && it.status !== "INITIALISERT";
              });
    });
};

const feilmeldingComponentTittel = (feilId: string, filnavn: string, listeMedFil: any) => {
    if (listeMedFil.length > 1) {
        return (
            <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={feilId} values={{antallFiler: listeMedFil.length}} />
            </SkjemaelementFeilmelding>
        );
    } else if (listeMedFil.length === 1) {
        return (
            <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={feilId} values={{filnavn: filnavn}} />
            </SkjemaelementFeilmelding>
        );
    } else {
        return (
            <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={feilId} />
            </SkjemaelementFeilmelding>
        );
    }
};

const feilmeldingComponent = (feilId: string) => {
    return (
        <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding">
            <li>
                <span className="oppgaver_vedlegg_feilmelding_bullet_point">
                    <FormattedMessage id={feilId} />
                </span>
            </li>
        </SkjemaelementFeilmelding>
    );
};

function returnFeilmeldingComponent(flagg: any, filnavn: any, listeMedFil: any) {
    return (
        <ul className="oppgaver_vedlegg_feilmelding_ul_plassering">
            {flagg.ulovligFil && feilmeldingComponentTittel("vedlegg.ulovlig_en_fil_feilmelding", filnavn, listeMedFil)}
            {flagg.ulovligFiler && feilmeldingComponentTittel("vedlegg.ulovlig_flere_fil_feilmelding", "", listeMedFil)}
            {flagg.maxSammensattFilStorrelse &&
                feilmeldingComponentTittel("vedlegg.ulovlig_storrelse_av_alle_valgte_filer", "", listeMedFil)}
            {flagg.containsUlovligeTegn && feilmeldingComponent("vedlegg.ulovlig_filnavn_feilmelding")}
            {flagg.legalFileExtension && feilmeldingComponent("vedlegg.ulovlig_filtype_feilmelding")}
            {flagg.maxFilStorrelse && feilmeldingComponent("vedlegg.ulovlig_filstorrelse_feilmelding")}
        </ul>
    );
}

export function skrivFeilmelding(listeMedFil: Array<FilFeil>, oppgaveElementIndex: number) {
    let filnavn = "";

    const flagg = {
        ulovligFil: false,
        ulovligFiler: false,
        legalFileExtension: false,
        containsUlovligeTegn: false,
        maxFilStorrelse: false,
        maxSammensattFilStorrelse: false,
    };

    listeMedFil.forEach((value) => {
        if (value.oppgaveElemendIndex === oppgaveElementIndex) {
            if (
                value.containsUlovligeTegn ||
                value.legalFileSize ||
                value.legalFileExtension ||
                value.legalCombinedFilesSize
            ) {
                if (listeMedFil.length === 1) {
                    filnavn = listeMedFil.length === 1 ? listeMedFil[0].filename : "";
                    flagg.ulovligFil = true;
                } else {
                    flagg.ulovligFiler = true;
                    flagg.ulovligFil = false;
                }
                if (value.legalFileSize) {
                    flagg.maxFilStorrelse = true;
                }
                if (value.containsUlovligeTegn) {
                    flagg.containsUlovligeTegn = true;
                }
                if (value.legalFileExtension) {
                    flagg.legalFileExtension = true;
                }
                if (value.legalCombinedFilesSize) {
                    flagg.maxSammensattFilStorrelse = true;
                    flagg.maxFilStorrelse = false;
                    flagg.containsUlovligeTegn = false;
                    flagg.legalFileExtension = false;
                    flagg.ulovligFiler = false;
                    flagg.ulovligFil = false;
                }
            }
        }
    });

    return returnFeilmeldingComponent(flagg, filnavn, listeMedFil);
}

export function finnFilerMedFeil(files: FileList, oppgaveElemendIndex: number): Array<FilFeil> {
    let sjekkMaxMengde = false;
    const filerMedFeil: Array<FilFeil> = [];
    let isCombinedFileSizeLegal = 0;

    for (let vedleggIndex = 0; vedleggIndex < files.length; vedleggIndex++) {
        const file: File = files[vedleggIndex];
        const filename = file.name;

        let fileErrorObject: FilFeil = {
            legalFileExtension: false,
            containsUlovligeTegn: false,
            legalFileSize: false,
            legalCombinedFilesSize: false,
            arrayIndex: vedleggIndex,
            oppgaveElemendIndex: oppgaveElemendIndex,
            filename: filename,
        };

        if (!legalFileExtension(filename)) {
            fileErrorObject.legalFileExtension = true;
        }
        if (containsUlovligeTegn(filename)) {
            fileErrorObject.containsUlovligeTegn = true;
        }
        if (legalFileSize(file)) {
            fileErrorObject.legalFileSize = true;
        }
        if (legalCombinedFilesSize(isCombinedFileSizeLegal)) {
            sjekkMaxMengde = true;
            fileErrorObject.legalCombinedFilesSize = true;
        }

        if (
            fileErrorObject.legalFileExtension ||
            fileErrorObject.containsUlovligeTegn ||
            fileErrorObject.legalFileSize ||
            fileErrorObject.legalCombinedFilesSize
        ) {
            filerMedFeil.push(fileErrorObject);
        }
        isCombinedFileSizeLegal += file.size;
    }

    if (sjekkMaxMengde) {
        logInfoMessage(
            "Bruker prøvde å laste opp over 150 mb. Størrelse på vedlegg var: " +
                isCombinedFileSizeLegal / (1024 * 1024)
        );
    }
    return filerMedFeil;
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

const alertUser = (event: any) => {
    event.preventDefault();
    event.returnValue = "";
};

const OppgaveElementView = (props: {
    typeTekst: string;
    tilleggsinfoTekst: string | undefined;
    oppgaveElement: OppgaveElement;
    oppgaveElementIndex: number;
    oppgaveIndex: number;
    oppgaveId: string;
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void;
}) => {
    const [listeMedFilerSomFeiler, setListeMedFilerSomFeiler] = useState<Array<FilFeil>>([]);

    const oppgaveVedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );

    useEffect(() => {
        if (props.oppgaveElement.filer && props.oppgaveElement.filer.length > 0) {
            window.addEventListener("beforeunload", alertUser);
        }
        return function unload() {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [props.oppgaveElement.filer]);

    const visOppgaverDetaljeFeil: boolean = oppgaveVedlegsOpplastingFeilet || listeMedFilerSomFeiler.length > 0;
    return (
        <div className={"oppgaver_detalj" + (visOppgaverDetaljeFeil ? " oppgaver_detalj_feil" : "")}>
            <VelgFil
                typeTekst={props.typeTekst}
                tilleggsinfoTekst={props.tilleggsinfoTekst}
                oppgaveElement={props.oppgaveElement}
                oppgaveElementIndex={props.oppgaveElementIndex}
                oppgaveIndex={props.oppgaveIndex}
                setListeMedFilerSomFeiler={setListeMedFilerSomFeiler}
                oppgaveId={props.oppgaveId}
                setOverMaksStorrelse={props.setOverMaksStorrelse}
            />

            {props.oppgaveElement.filer &&
                props.oppgaveElement.filer.length > 0 &&
                props.oppgaveElement.filer.map((fil: Fil, vedleggIndex: number) => (
                    <FilView
                        key={vedleggIndex}
                        fil={fil}
                        oppgaveElement={props.oppgaveElement}
                        vedleggIndex={vedleggIndex}
                        oppgaveElementIndex={props.oppgaveElementIndex}
                        oppgaveIndex={props.oppgaveIndex}
                        setOverMaksStorrelse={props.setOverMaksStorrelse}
                        oppgaveId={props.oppgaveId}
                    />
                ))}
            {validerFilArrayForFeil(listeMedFilerSomFeiler) &&
                skrivFeilmelding(listeMedFilerSomFeiler, props.oppgaveElementIndex)}
        </div>
    );
};

const VelgFil = (props: {
    typeTekst: string;
    tilleggsinfoTekst: string | undefined;
    oppgaveElement: OppgaveElement;
    oppgaveElementIndex: number;
    oppgaveIndex: number;
    setListeMedFilerSomFeiler: (filerMedFeil: Array<FilFeil>) => void;
    oppgaveId: string;
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void;
}) => {
    const dispatch = useDispatch();

    const kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggTillat(kommuneResponse);

    const onClick = (oppgaveElementIndex: number, event?: any): void => {
        const handleOnLinkClicked = (response: boolean) => {
            dispatch(setOppgaveVedleggopplastingFeilet(response));
        };
        if (handleOnLinkClicked) {
            handleOnLinkClicked(false);
        }
        const uploadElement: any = document.getElementById("file_" + props.oppgaveIndex + "_" + oppgaveElementIndex);
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (
        event: any,
        oppgaveElement: OppgaveElement,
        oppgaveElementIndex: number,
        oppgaveIndex: number
    ) => {
        props.setListeMedFilerSomFeiler([]);
        props.setOverMaksStorrelse(false);
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            dispatch(setOppgaveOpplastingFeilet(props.oppgaveId, false));
            dispatch(setOppgaveOpplastingFeiletPaBackend(props.oppgaveId, false));
            dispatch(setOppgaveOpplastingFeiletVirussjekkPaBackend(props.oppgaveId, false));

            const filerMedFeil: Array<FilFeil> = finnFilerMedFeil(files, oppgaveElementIndex);
            if (filerMedFeil.length === 0) {
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
                    if (!file) {
                        logInfoMessage("Tom fil ble forsøkt lagt til i OppgaveView.VelgFil.onChange()");
                    } else {
                        dispatch({
                            type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                            oppgaveElement: oppgaveElement,
                            oppgaveElementIndex: oppgaveElementIndex,
                            oppgaveIndex: oppgaveIndex,
                            fil: {
                                filnavn: file.name,
                                status: "INITIALISERT",
                                file: file,
                            },
                        });
                    }
                }
            } else {
                props.setListeMedFilerSomFeiler(filerMedFeil);
                filerMedFeil.forEach((fil: FilFeil) => {
                    if (fil.containsUlovligeTegn) {
                        logInfoMessage("Validering vedlegg feilet: Fil inneholder ulovlige tegn");
                    }
                    if (fil.legalCombinedFilesSize) {
                        logInfoMessage("Validering vedlegg feilet: Totalt over 150MB ved en opplasting");
                    }
                    if (fil.legalFileExtension) {
                        logInfoMessage("Validering vedlegg feilet: Ulovlig filtype");
                    }
                    if (fil.legalFileSize) {
                        logInfoMessage("Validering vedlegg feilet: Fil over 10MB");
                    }
                });
            }
        }
        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    return (
        <div className={"oppgave-detalj-overste-linje"}>
            <div className={"tekst-wrapping"}>
                <Element>{props.typeTekst}</Element>
            </div>
            {props.tilleggsinfoTekst && (
                <div className={"tekst-wrapping"}>
                    <Normaltekst className="luft_over_4px">{props.tilleggsinfoTekst}</Normaltekst>
                </div>
            )}
            {kanLasteOppVedlegg && (
                <div className="oppgaver_last_opp_fil">
                    <Flatknapp
                        mini
                        id={"oppgave_" + props.oppgaveElementIndex + "_last_opp_fil_knapp"}
                        onClick={(event) => {
                            onClick(props.oppgaveElementIndex, event);
                        }}
                    >
                        <UploadFileIcon className="last_opp_fil_ikon" />
                        <Element>
                            <FormattedMessage id="vedlegg.velg_fil" />
                        </Element>
                    </Flatknapp>
                    <input
                        type="file"
                        id={"file_" + props.oppgaveIndex + "_" + props.oppgaveElementIndex}
                        multiple={true}
                        onChange={(event: ChangeEvent) =>
                            onChange(event, props.oppgaveElement, props.oppgaveElementIndex, props.oppgaveIndex)
                        }
                        style={{display: "none"}}
                    />
                </div>
            )}
        </div>
    );
};

const OppgaveView: React.FC<Props> = ({oppgave, oppgaverErFraInnsyn, oppgaveIndex}) => {
    const dispatch = useDispatch();
    const listeOverOpggaveIderSomFeilet: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOpggaveIderSomFeilet
    );
    const listeOverOppgaveIderSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletPaBackend
    );
    const listeOverOppgaveIderSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletIVirussjekkPaBackend
    );

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggTillat(kommuneResponse);

    const opplastingFeilet = harFilerMedFeil(oppgave.oppgaveElementer);

    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(oppgave.innsendelsesfrist!!));
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const otherVedleggLastesOpp =
        otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const sendVedlegg = (event: any) => {
        window.removeEventListener("beforeunload", alertUser);
        dispatch(setOppgaveOpplastingFeiletPaBackend(oppgave.oppgaveId, false));
        dispatch(setOppgaveOpplastingFeiletVirussjekkPaBackend(oppgave.oppgaveId, false));

        if (!oppgave || !fiksDigisosId) {
            event.preventDefault();
            return;
        }

        try {
            var formData = opprettFormDataMedVedleggFraOppgaver(oppgave);
        } catch (e) {
            dispatch(setOppgaveOpplastingFeilet(oppgave.oppgaveId, true));
            logInfoMessage("Validering vedlegg feilet: " + e.message);
            event.preventDefault();
            return;
        }
        const sti: InnsynsdataSti = InnsynsdataSti.VEDLEGG;
        const path = innsynsdataUrl(fiksDigisosId, sti);

        dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.PENDING));

        const ingenFilerValgt = harIkkeValgtFiler(oppgave);
        dispatch(setOppgaveOpplastingFeilet(oppgave.oppgaveId, ingenFilerValgt));

        setOverMaksStorrelse(false);

        const sammensattFilStorrelseForOppgaveElement = oppgave.oppgaveElementer
            .flatMap((oppgaveElement: OppgaveElement) => {
                return oppgaveElement.filer ?? [];
            })
            .reduce(
                (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file?.size : 0),
                0
            );

        setOverMaksStorrelse(sammensattFilStorrelseForOppgaveElement > maxMengdeStorrelse);

        if (ingenFilerValgt) {
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            logInfoMessage("Validering vedlegg feilet: Ingen filer valgt");
            event.preventDefault();
            return;
        }

        if (sammensattFilStorrelseForOppgaveElement > maxMengdeStorrelse) {
            logInfoMessage("Validering vedlegg feilet: Totalt over 150MB for alle oppgaver");
        }

        if (
            sammensattFilStorrelseForOppgaveElement < maxMengdeStorrelse &&
            sammensattFilStorrelseForOppgaveElement !== 0
        ) {
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
                        dispatch(hentOppgaveMedId(fiksDigisosId, InnsynsdataSti.OPPGAVER, oppgave.oppgaveId));
                        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
                        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
                    }
                })
                .catch((e) => {
                    // Kjør feilet kall på nytt for å få tilgang til feilmelding i JSON data:
                    fetchPostGetErrors(path, formData, "multipart/form-data").then((errorResponse: any) => {
                        if (errorResponse.message === "Mulig virus funnet") {
                            dispatch(setOppgaveOpplastingFeiletPaBackend(oppgave.oppgaveId, false));
                            dispatch(setOppgaveOpplastingFeiletVirussjekkPaBackend(oppgave.oppgaveId, true));
                        }
                    });
                    dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
                    dispatch(setOppgaveOpplastingFeiletPaBackend(oppgave.oppgaveId, true));
                    logWarningMessage("Feil med opplasting av vedlegg: " + e.message);
                });
        } else {
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
        }
        event.preventDefault();
    };

    const visOppgaverDetaljeFeiler: boolean =
        listeOverOpggaveIderSomFeilet.includes(oppgave.oppgaveId) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        listeOverOppgaveIderSomFeiletPaBackend.includes(oppgave.oppgaveId) ||
        listeOverOppgaveIderSomFeiletIVirussjekkPaBackend.includes(oppgave.oppgaveId);

    return (
        <div>
            <div
                className={
                    (visOppgaverDetaljeFeiler ? "oppgaver_detaljer_feil_ramme" : "oppgaver_detaljer") +
                    " luft_over_1rem"
                }
            >
                {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert <= 0 && (
                    <Normaltekst className="luft_under_8px">
                        <FormattedMessage
                            id="oppgaver.innsendelsesfrist"
                            values={{innsendelsesfrist: formatDato(oppgave.innsendelsesfrist!)}}
                        />
                    </Normaltekst>
                )}
                {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert > 0 && (
                    <Normaltekst className="luft_under_8px">
                        <FormattedMessage
                            id="oppgaver.innsendelsesfrist_passert"
                            values={{innsendelsesfrist: formatDato(oppgave.innsendelsesfrist!)}}
                        />
                    </Normaltekst>
                )}
                {oppgave.oppgaveElementer.map((oppgaveElement, oppgaveElementIndex) => {
                    let {typeTekst, tilleggsinfoTekst} = getVisningstekster(
                        oppgaveElement.dokumenttype,
                        oppgaveElement.tilleggsinformasjon
                    );
                    return (
                        <OppgaveElementView
                            key={oppgaveElementIndex}
                            typeTekst={typeTekst}
                            tilleggsinfoTekst={tilleggsinfoTekst}
                            oppgaveElement={oppgaveElement}
                            oppgaveElementIndex={oppgaveElementIndex}
                            oppgaveIndex={oppgaveIndex}
                            oppgaveId={oppgave.oppgaveId}
                            setOverMaksStorrelse={setOverMaksStorrelse}
                        />
                    );
                })}

                {kanLasteOppVedlegg && (
                    <Hovedknapp
                        disabled={vedleggLastesOpp || otherVedleggLastesOpp}
                        spinner={vedleggLastesOpp}
                        type="hoved"
                        className="luft_over_1rem"
                        onClick={(event: any) => {
                            sendVedlegg(event);
                        }}
                    >
                        <FormattedMessage id="oppgaver.send_knapp_tittel" />
                    </Hovedknapp>
                )}
            </div>

            {listeOverOppgaveIderSomFeiletPaBackend.includes(oppgave.oppgaveId) && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.opplasting_backend_feilmelding"} />
                </SkjemaelementFeilmelding>
            )}

            {listeOverOppgaveIderSomFeiletIVirussjekkPaBackend.includes(oppgave.oppgaveId) && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.opplasting_backend_virus_feilmelding"} />
                </SkjemaelementFeilmelding>
            )}

            {overMaksStorrelse && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.ulovlig_storrelse_av_alle_valgte_filer"} />
                </SkjemaelementFeilmelding>
            )}
            {(listeOverOpggaveIderSomFeilet.includes(oppgave.oppgaveId) || opplastingFeilet) && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage
                        id={
                            listeOverOpggaveIderSomFeilet.includes(oppgave.oppgaveId)
                                ? "vedlegg.minst_ett_vedlegg"
                                : "vedlegg.opplasting_feilmelding"
                        }
                    />
                </SkjemaelementFeilmelding>
            )}
        </div>
    );
};

export default OppgaveView;
