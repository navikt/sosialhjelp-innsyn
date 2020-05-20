import React, {useState} from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import UploadFileIcon from "../ikoner/UploadFile";
import {
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    KommuneResponse,
    Oppgave,
    OppgaveElement,
    settRestStatus,
    Vedlegg,
} from "../../redux/innsynsdata/innsynsdataReducer";
import VedleggActionsView from "./VedleggActionsView";
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
    logErrorMessage,
    logInfoMessage,
    setOppgaveVedleggopplastingFeilet,
    hentOppgaveMedId,
    setOppgaveOpplastingFeilet,
    setOppgaveOpplastingFeiletPaBackend,
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
import {Hovedknapp} from "nav-frontend-knapper";
import {fetchPost, REST_STATUS} from "../../utils/restUtils";

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
            <div className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={feilId} values={{antallFiler: listeMedFil.length}} />
            </div>
        );
    } else if (listeMedFil.length === 1) {
        return (
            <div className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={feilId} values={{filnavn: filnavn}} />
            </div>
        );
    } else {
        return (
            <div className="oppgaver_vedlegg_feilmelding_overskrift">
                <FormattedMessage id={feilId} />
            </div>
        );
    }
};

const feilmeldingComponent = (feilId: string) => {
    return (
        <div className="oppgaver_vedlegg_feilmelding">
            <li>
                <span className="oppgaver_vedlegg_feilmelding_bullet_point">
                    <FormattedMessage id={feilId} />
                </span>
            </li>
        </div>
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

            {props.oppgaveElement.vedlegg &&
                props.oppgaveElement.vedlegg.length > 0 &&
                props.oppgaveElement.vedlegg.map((vedlegg: Vedlegg, vedleggIndex: number) => (
                    <VedleggActionsView vedlegg={vedlegg} key={vedleggIndex} />
                ))}

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

    const onLinkClicked = (
        oppgaveElementIndex: number,
        event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ): void => {
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

            const filerMedFeil: Array<FilFeil> = finnFilerMedFeil(files, oppgaveElementIndex);
            if (filerMedFeil.length === 0) {
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
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
            } else {
                props.setListeMedFilerSomFeiler(filerMedFeil);
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
                    <UploadFileIcon
                        className="last_opp_fil_ikon"
                        onClick={(event: any) => {
                            onLinkClicked(props.oppgaveElementIndex, event);
                        }}
                    />
                    <Lenke
                        href="#"
                        id={"oppgave_" + props.oppgaveElementIndex + "_last_opp_fil_knapp"}
                        className="lenke_uten_ramme"
                        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                            onLinkClicked(props.oppgaveElementIndex, event);
                        }}
                    >
                        <Element>
                            <FormattedMessage id="vedlegg.velg_fil" />
                        </Element>
                    </Lenke>
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
        dispatch(setOppgaveOpplastingFeiletPaBackend(oppgave.oppgaveId, false));

        if (!oppgave || !fiksDigisosId) {
            event.preventDefault();
            return;
        }

        let formData = opprettFormDataMedVedleggFraOppgaver(oppgave);
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
            event.preventDefault();
            return;
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
                    dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
                    dispatch(setOppgaveOpplastingFeiletPaBackend(oppgave.oppgaveId, true));
                    logErrorMessage("Feil med opplasting av vedlegg: " + e.message);
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
        listeOverOppgaveIderSomFeiletPaBackend.includes(oppgave.oppgaveId);

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
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.opplasting_backend_feilmelding"} />
                </div>
            )}

            {overMaksStorrelse && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.ulovlig_storrelse_av_alle_valgte_filer"} />
                </div>
            )}
            {(listeOverOpggaveIderSomFeilet.includes(oppgave.oppgaveId) || opplastingFeilet) && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage
                        id={
                            listeOverOpggaveIderSomFeilet.includes(oppgave.oppgaveId)
                                ? "vedlegg.minst_ett_vedlegg"
                                : "vedlegg.opplasting_feilmelding"
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default OppgaveView;
