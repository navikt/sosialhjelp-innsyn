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
import {erOpplastingAvVedleggEnabled} from "../driftsmelding/DriftsmeldingUtilities";
import {
    hentInnsynsdata,
    innsynsdataUrl,
    logErrorMessage,
    logInfoMessage,
    setOppgaveVedleggopplastingFeilet,
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

export function sjekkerFilFeil(
    files: FileList,
    oppgaveElemendIndex: number,
    sammensattFilstorrelse: number,
    filerMedFeil: Array<FilFeil>,
    setListeMedFil: (filerMedFeil: Array<FilFeil>) => void
) {
    let sjekkMaxMengde = false;
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
        if (legalCombinedFilesSize(sammensattFilstorrelse)) {
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
        sammensattFilstorrelse += file.size;
    }
    setListeMedFil(filerMedFeil);

    if (sjekkMaxMengde) {
        logInfoMessage(
            "Bruker prøvde å laste opp over 350 mb. Størrelse på vedlegg var: " + sammensattFilstorrelse / (1024 * 1024)
        );
    }
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

const OppgaveView: React.FC<Props> = ({oppgave, oppgaverErFraInnsyn, oppgaveIndex}) => {
    const dispatch = useDispatch();
    const [listeMedFil, setListeMedFil] = useState<Array<FilFeil>>([]);
    const oppgaveVedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );
    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggEnabled(kommuneResponse);
    const opplastingFeilet = harFilerMedFeil(oppgave.oppgaveElementer);
    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(oppgave.innsendelsesfrist!!));
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const otherVedleggLastesOpp =
        otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const onLinkClicked = (
        oppgaveElementIndex: number,
        event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ): void => {
        let handleOnLinkClicked = (response: boolean) => {
            dispatch(setOppgaveVedleggopplastingFeilet(response));
        };
        if (handleOnLinkClicked) {
            handleOnLinkClicked(false);
        }
        const uploadElement: any = document.getElementById("file_" + oppgaveIndex + "_" + oppgaveElementIndex);
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
        const files: FileList | null = event.currentTarget.files;
        let sammensattFilstorrelse = 0;
        let filerMedFeil: Array<FilFeil> = [];

        if (files) {
            sjekkerFilFeil(files, oppgaveElementIndex, sammensattFilstorrelse, filerMedFeil, setListeMedFil);

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
            }
        }
        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    const sendVedlegg = (event: any) => {
        if (!oppgave || !fiksDigisosId) {
            event.preventDefault();
            return;
        }

        let formData = opprettFormDataMedVedleggFraOppgaver(oppgave);
        const sti: InnsynsdataSti = InnsynsdataSti.VEDLEGG;
        const path = innsynsdataUrl(fiksDigisosId, sti);

        dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.PENDING));

        const ingenFilerValgt = harIkkeValgtFiler(oppgave);
        dispatch(setOppgaveVedleggopplastingFeilet(ingenFilerValgt));

        //denne sjekker total sammensatt fil størrelse
        // dette funger, men foreløpig vises ikke en feilmelding
        function setterStorrelse(oppgave: Oppgave) {
            let sammensattFilStorrelse = 0;
            oppgave.oppgaveElementer.forEach((oppgaveElement: OppgaveElement) => {
                if (oppgaveElement.filer) {
                    oppgaveElement.filer.forEach((file: Fil) => {
                        if (file.file?.size) {
                            sammensattFilStorrelse += file.file.size;
                        }
                    });
                }
            });
            return sammensattFilStorrelse;
        }

        const sammensattFilStorrelse: number = setterStorrelse(oppgave);

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

    function velgFil(
        typeTekst: string,
        tilleggsinfoTekst: string | undefined,
        oppgaveElement: OppgaveElement,
        oppgaveElementIndex: number,
        oppgaveIndex: number
    ) {
        return (
            <div className={"oppgave-detalj-overste-linje"}>
                <div className={"tekst-wrapping"}>
                    <Element>{typeTekst}</Element>
                </div>
                {tilleggsinfoTekst && (
                    <div className={"tekst-wrapping"}>
                        <Normaltekst className="luft_over_4px">{tilleggsinfoTekst}</Normaltekst>
                    </div>
                )}
                {kanLasteOppVedlegg && (
                    <div className="oppgaver_last_opp_fil">
                        <UploadFileIcon
                            className="last_opp_fil_ikon"
                            onClick={(event: any) => {
                                onLinkClicked(oppgaveElementIndex, event);
                            }}
                        />
                        <Lenke
                            href="#"
                            id={"oppgave_" + oppgaveElementIndex + "_last_opp_fil_knapp"}
                            className="lenke_uten_ramme"
                            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                onLinkClicked(oppgaveElementIndex, event);
                            }}
                        >
                            <Element>
                                <FormattedMessage id="vedlegg.velg_fil" />
                            </Element>
                        </Lenke>
                        <input
                            type="file"
                            id={"file_" + oppgaveIndex + "_" + oppgaveElementIndex}
                            multiple={true}
                            onChange={(event: ChangeEvent) =>
                                onChange(event, oppgaveElement, oppgaveElementIndex, oppgaveIndex)
                            }
                            style={{display: "none"}}
                        />
                    </div>
                )}
            </div>
        );
    }

    function getOppgaveDetaljer(
        typeTekst: string,
        tilleggsinfoTekst: string | undefined,
        oppgaveElement: OppgaveElement,
        oppgaveElementIndex: number,
        oppgaveIndex: number
    ): JSX.Element {
        const listeMedFeilForOppgaveElementIndex = listeMedFil.filter(
            (value) => value.oppgaveElemendIndex === oppgaveElementIndex
        );
        const visOppgaverDetaljeFeil: boolean =
            oppgaveVedlegsOpplastingFeilet ||
            opplastingFeilet !== undefined ||
            listeMedFeilForOppgaveElementIndex.length > 0;
        return (
            <div
                key={oppgaveElementIndex}
                className={"oppgaver_detalj" + (visOppgaverDetaljeFeil ? " oppgaver_detalj_feil" : "")}
            >
                {velgFil(typeTekst, tilleggsinfoTekst, oppgaveElement, oppgaveElementIndex, oppgaveIndex)}

                {oppgaveElement.vedlegg &&
                    oppgaveElement.vedlegg.length > 0 &&
                    oppgaveElement.vedlegg.map((vedlegg: Vedlegg, vedleggIndex: number) => (
                        <VedleggActionsView vedlegg={vedlegg} key={vedleggIndex} />
                    ))}

                {oppgaveElement.filer &&
                    oppgaveElement.filer.length > 0 &&
                    oppgaveElement.filer.map((fil: Fil, vedleggIndex: number) => (
                        <FilView
                            key={vedleggIndex}
                            fil={fil}
                            oppgaveElement={oppgaveElement}
                            vedleggIndex={vedleggIndex}
                            oppgaveElementIndex={oppgaveElementIndex}
                            oppgaveIndex={oppgaveIndex}
                        />
                    ))}
                {validerFilArrayForFeil(listeMedFil) && skrivFeilmelding(listeMedFil, oppgaveElementIndex)}
            </div>
        );
    }

    const visOppgaverDetaljeFeiler: boolean =
        oppgaveVedlegsOpplastingFeilet || opplastingFeilet !== undefined || listeMedFil.length > 0;
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
                    return getOppgaveDetaljer(
                        typeTekst,
                        tilleggsinfoTekst,
                        oppgaveElement,
                        oppgaveElementIndex,
                        oppgaveIndex
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
            {(oppgaveVedlegsOpplastingFeilet || opplastingFeilet) && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage
                        id={
                            oppgaveVedlegsOpplastingFeilet
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
