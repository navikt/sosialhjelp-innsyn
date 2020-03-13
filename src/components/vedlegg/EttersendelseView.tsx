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
    logErrorMessage,
    logInfoMessage,
} from "../../redux/innsynsdata/innsynsDataActions";
import {fetchPost, REST_STATUS} from "../../utils/restUtils";
import {
    containsUlovligeTegn,
    legalFileExtension,
    legalFileSize,
    legalCombinedFilesSize,
    opprettFormDataMedVedleggFraFiler,
    FilFeil,
} from "../../utils/vedleggUtils";
import {erOpplastingAvVedleggEnabled} from "../driftsmelding/DriftsmeldingUtilities";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";

function harFilermedFeil(filer: Fil[]) {
    return filer.find(it => {
        return it.status !== "OK" && it.status !== "PENDING" && it.status !== "INITIALISERT";
    });
}

const feilmeldingComponentTittel = (
    feilId: string,
    filnavn: string,
    listeMedFil: any,
    maxSammensattFilStorrelse: boolean
) => {
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

function skrivFeilmelding(listeMedFil: Array<FilFeil>) {
    let filnavn = "";

    const flagg = {
        ulovligFil: false,
        ulovligFiler: false,
        legalFileExtension: false,
        containsUlovligeTegn: false,
        maxFilStorrelse: false,
        maxSammensattFilStorrelse: false,
    };

    listeMedFil.forEach(value => {
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
    });

    return (
        <ul>
            {flagg.ulovligFil &&
                feilmeldingComponentTittel(
                    "vedlegg.ulovlig_en_fil_feilmelding",
                    filnavn,
                    listeMedFil,
                    flagg.maxSammensattFilStorrelse
                )}
            {flagg.ulovligFiler &&
                feilmeldingComponentTittel(
                    "vedlegg.ulovlig_flere_fil_feilmelding",
                    "",
                    listeMedFil,
                    flagg.maxSammensattFilStorrelse
                )}
            {flagg.maxSammensattFilStorrelse &&
                feilmeldingComponentTittel(
                    "vedlegg.ulovlig_storrelse_av_alle_valgte_filer",
                    "",
                    listeMedFil,
                    flagg.maxSammensattFilStorrelse
                )}
            {flagg.containsUlovligeTegn && feilmeldingComponent("vedlegg.ulovlig_filnavn_feilmelding")}
            {flagg.legalFileExtension && feilmeldingComponent("vedlegg.ulovlig_filtype_feilmelding")}
            {flagg.maxFilStorrelse && feilmeldingComponent("vedlegg.ulovlig_filstorrelse_feilmelding")}
        </ul>
    );
}

const EttersendelseView: React.FC = () => {
    const dispatch = useDispatch();
    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [listeMedFil, setListeMedFil] = useState<Array<FilFeil>>([]);
    const filer: Fil[] = useSelector((state: InnsynAppState) => state.innsynsdata.ettersendelse.filer);
    //const feil: Vedleggfeil | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.ettersendelse.feil);
    const vedleggKlarForOpplasting = filer.length > 0;
    const [sendVedleggTrykket, setSendVedleggTrykket] = useState<boolean>(false);
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const otherVedleggLastesOpp =
        otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;
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
        const files: FileList | null = event.currentTarget.files;
        let sammensattFilstorrelse = 0;
        let filerMedFeil = [];

        if (files) {
            let sjekkMaxMengde = false;
            for (let index = 0; index < files.length; index++) {
                const file: File = files[index];
                const filename = file.name;

                let fileErrorObject: FilFeil = {
                    legalFileExtension: false,
                    containsUlovligeTegn: false,
                    legalFileSize: false,
                    legalCombinedFilesSize: false,
                    arrayIndex: 0,
                    oppgaveIndex: 0,
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
                    "Bruker prøvde å laste opp over 350 mb. Størrelse på vedlegg var: " +
                        sammensattFilstorrelse / (1024 * 1024)
                );
            }

            if (filerMedFeil.length === 0) {
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
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
        }
        if (event.target.value === "") {
            return;
        }
        event.preventDefault();
    };

    const sendVedlegg = (event: any) => {
        if (!fiksDigisosId) {
            event.preventDefault();
            return;
        }

        let formData = opprettFormDataMedVedleggFraFiler(filer);
        const sti: InnsynsdataSti = InnsynsdataSti.SEND_VEDLEGG;
        const path = innsynsdataUrl(fiksDigisosId, sti);
        dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.PENDING));

        fetchPost(path, formData, "multipart/form-data")
            .then((filRespons: any) => {
                let harFeil: boolean = false;
                if (Array.isArray(filRespons)) {
                    for (let index = 0; index < filRespons.length; index++) {
                        const fileItem = filRespons[index];
                        if (fileItem.status !== "OK") {
                            harFeil = true;
                        }
                        dispatch({
                            type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_ETTERSENDELSESFIL,
                            fil: {filnavn: fileItem.filnavn} as Fil,
                            status: fileItem.status,
                            index: index,
                        });
                    }
                }
                if (harFeil) {
                    dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.FEILET));
                } else {
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
                }
            })
            .catch(e => {
                logErrorMessage("Feil med opplasting av vedlegg: " + e.message);
            });
        event.preventDefault();
    };

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggEnabled(kommuneResponse);

    function validerFilArrayForFeil() {
        return listeMedFil && listeMedFil.length ? true : false;
    }

    return (
        <div>
            <DriftsmeldingVedlegg
                leserData={restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING}
            />
            <div
                className={
                    "oppgaver_detaljer " +
                    (opplastingFeilet || listeMedFil.length > 0 || (!vedleggKlarForOpplasting && sendVedleggTrykket)
                        ? " oppgaver_detalj_feil_ramme"
                        : "")
                }
            >
                <div
                    className={
                        "oppgaver_detalj " +
                        (opplastingFeilet || listeMedFil.length > 0 || (!vedleggKlarForOpplasting && sendVedleggTrykket)
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
                        filer.map((fil: Fil, index: number) => <FilView key={index} fil={fil} index={index} />)}

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

                    {validerFilArrayForFeil() && skrivFeilmelding(listeMedFil)}
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
