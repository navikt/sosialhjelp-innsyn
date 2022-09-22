import React, {useEffect, useState} from "react";
import {Fil, InnsynsdataSti, KommuneResponse, settRestStatus} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {REST_STATUS} from "../../utils/restUtils";
import {
    alertUser,
    createFormDataWithVedleggFromFiler,
    hasFilesWithErrorStatus,
    illegalCombinedFilesSize,
} from "../../utils/vedleggUtils";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";
import {onSendVedleggClicked} from "../oppgaver/onSendVedleggClickedNew";
import AddFileButton, {TextAndButtonWrapper} from "../oppgaver/AddFileButton";
import {v4 as uuidv4} from "uuid";
import FileItemView from "../oppgaver/FileItemView";
import {
    hentInnsynsdata,
    innsynsdataUrl,
    setFileUploadFailed,
    setFileUploadFailedInBackend,
    setFileUploadFailedVirusCheckInBackend,
} from "../../redux/innsynsdata/innsynsDataActions";
import {fileUploadFailedEvent, logButtonOrLinkClick} from "../../utils/amplitude";
import {BodyShort, Button, Label, Loader} from "@navikt/ds-react";
import styled from "styled-components/macro";
import {FileValidationErrors} from "../oppgaver/DokumentasjonkravElementView";
import {validateFile} from "../oppgaver/validateFile";
import {ErrorMessageTitle} from "../oppgaver/ErrorMessageTitleNew";
import {ErrorMessage} from "../errors/ErrorMessage";
import InnerErrorMessage from "../oppgaver/ErrorMessage";

/*
 * Siden det er ikke noe form for oppgaveId så blir BACKEND_FEIL_ID
 * brukt sånnn at man slipper å lage egne actions
 * og reducere for denne ene komponenten.
 */
const BACKEND_FEIL_ID = "backendFeilId";

interface Props {
    restStatus: REST_STATUS;
}

const ButtonWrapper = styled.div`
    margin-top: 1rem;
`;

const EttersendelseView: React.FC<Props> = ({restStatus}) => {
    const dispatch = useDispatch();
    const uuid = uuidv4();

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const [fileValidationErrors, setFileValidationErrors] = useState<FileValidationErrors | undefined>(undefined);

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const [filerGet, setFilerGet] = useState<Fil[]>([]);

    const [isUploading, setIsUploading] = useState(false);

    const listeOverVedleggIderSomFeilet: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOpggaveIderSomFeilet
    );

    const listeOverVedleggIderSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletPaBackend
    );
    const listeOverOppgaveIderSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletIVirussjekkPaBackend
    );

    const opplastingFeilet = hasFilesWithErrorStatus(filerGet);

    const vedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );

    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommuneResponse);

    useEffect(() => {
        if (filerGet.length > 0) {
            window.addEventListener("beforeunload", alertUser);
        }
        return function unload() {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [filerGet]);

    const visDetaljeFeiler: boolean =
        listeOverVedleggIderSomFeilet.includes(BACKEND_FEIL_ID) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        listeOverVedleggIderSomFeiletPaBackend.includes(BACKEND_FEIL_ID) ||
        listeOverOppgaveIderSomFeiletIVirussjekkPaBackend.includes(BACKEND_FEIL_ID);

    const visVedleggFeil: boolean =
        vedlegsOpplastingFeilet || (fileValidationErrors !== undefined && fileValidationErrors.errors.size > 0);

    const onSendClick = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (!fiksDigisosId || overMaksStorrelse) {
            return;
        }
        setIsUploading(true);
        setErrorMessage(undefined);

        const path = innsynsdataUrl(fiksDigisosId, InnsynsdataSti.VEDLEGG);
        dispatch(setFileUploadFailed(BACKEND_FEIL_ID, filerGet.length === 0));
        console.log("ettersendelse", filerGet);

        if (filerGet.length === 0) {
            setErrorMessage("vedlegg.minst_ett_vedlegg");
            fileUploadFailedEvent("vedlegg.minst_ett_vedlegg");
            setIsUploading(false);
            console.log("har ikke vedlegg");
        }

        const handleFileWithVirus = () => {
            setErrorMessage("vedlegg.opplasting_backend_virus_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_backend_virus_feilmelding");
            setIsUploading(false);
            dispatch(setFileUploadFailedInBackend(BACKEND_FEIL_ID, false));
            dispatch(setFileUploadFailedVirusCheckInBackend(BACKEND_FEIL_ID, true));
            console.log("ettersendelse handleFileWithVirus filer", filerGet);
        };
        const handleFileUploadFailed = () => {
            dispatch(hentInnsynsdata(BACKEND_FEIL_ID, InnsynsdataSti.VEDLEGG, false));
            setErrorMessage("vedlegg.opplasting_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_feilmelding");
            setIsUploading(false);
            dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.FEILET));
            dispatch(setFileUploadFailedInBackend(BACKEND_FEIL_ID, true));
            console.log("ettersendelse handleFileUploadFailed filer", filerGet);
        };
        const onSuccessful = (reference: string) => {
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.VEDLEGG, false));
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.HENDELSER, false));
            console.log("ettersendelse onSuccessful filer", filerGet);

            setIsUploading(false);
        };

        const formData = createFormDataWithVedleggFromFiler(filerGet);
        const filer = filerGet;
        if (!filer || filer.length === 0) {
            return;
        }

        onSendVedleggClicked(
            BACKEND_FEIL_ID,
            formData,
            filer,
            path,
            handleFileWithVirus,
            handleFileUploadFailed,
            onSuccessful
        );
    };

    const onChange = (event: any) => {
        setErrorMessage(undefined);
        setFileValidationErrors(undefined);
        dispatch(setFileUploadFailed(BACKEND_FEIL_ID, false));
        dispatch(setFileUploadFailedInBackend(BACKEND_FEIL_ID, false));
        dispatch(setFileUploadFailedVirusCheckInBackend(BACKEND_FEIL_ID, false));

        const files: FileList | null = event.currentTarget.files;
        if (files) {
            const opplastedeFiler = Array.from(files).map((file: File) => {
                return {filnavn: file.name, status: "INITIALISERT", file: file};
            });
            const result = validateFile(opplastedeFiler);
            if (result.errors.size) {
                setFileValidationErrors({errors: result.errors, filenames: result.filenames});
            }
            if (result.validFiles.length) {
                let newFiler = {...filerGet};
                //if (filerGet.length) {
                if (newFiler.length) {
                    //setFilerGet(filerGet.concat(result.validFiles));
                    newFiler.concat(result.validFiles);
                } else {
                    //setFilerGet(result.validFiles);
                    newFiler = result.validFiles;
                }
                const totalFileSize = filerGet.reduce(
                    (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
                    0
                );

                if (illegalCombinedFilesSize(totalFileSize)) {
                    setOverMaksStorrelse(true);
                    setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
                    fileUploadFailedEvent("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
                }
                setFilerGet(newFiler);
            }

            if (event.target.value === "") {
                return;
            }
            event.target.value = null;
            event.preventDefault();
        }
    };

    const onDeleteClick = (event: any, fil: Fil) => {
        setFileValidationErrors(undefined);
        setErrorMessage(undefined);
        const remainingFiles = filerGet.filter((filene) => filene.file !== fil.file);
        setFilerGet(remainingFiles);

        const totalFileSize = filerGet.reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
            0
        );

        if (illegalCombinedFilesSize(totalFileSize)) {
            setOverMaksStorrelse(true);
            setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            fileUploadFailedEvent("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
        }
        event.preventDefault();
    };

    return (
        <>
            <DriftsmeldingVedlegg
                leserData={restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING}
            />

            <div className={visDetaljeFeiler ? "oppgaver_detalj_feil_ramme " : "oppgaver_detaljer"}>
                <div
                    className={"oppgaver_detalj " + (visVedleggFeil ? " oppgaver_detalj_feil" : "")}
                    style={{marginTop: "0px"}}
                >
                    <TextAndButtonWrapper>
                        <div>
                            <Label>
                                <FormattedMessage id="andre_vedlegg.type" />
                            </Label>
                            <BodyShort>
                                <FormattedMessage id="andre_vedlegg.tilleggsinfo" />
                            </BodyShort>
                        </div>
                        {kanLasteOppVedlegg && (
                            <AddFileButton onChange={onChange} referanse={BACKEND_FEIL_ID} id={uuid} />
                        )}
                    </TextAndButtonWrapper>

                    {filerGet.map((fil: Fil, vedleggIndex: number) => (
                        <FileItemView
                            key={vedleggIndex}
                            fil={fil}
                            onDelete={(event: MouseEvent, fil) => {
                                onDeleteClick(event, fil);
                            }}
                        />
                    ))}
                    {fileValidationErrors && fileValidationErrors?.errors.size && (
                        <div>
                            {fileValidationErrors.filenames.size === 1 ? (
                                <ErrorMessageTitle
                                    feilId={"vedlegg.ulovlig_en_fil_feilmelding"}
                                    errorValue={{filnavn: Array.from(fileValidationErrors.filenames)[0]}}
                                />
                            ) : (
                                <ErrorMessageTitle
                                    feilId={"vedlegg.ulovlig_flere_fil_feilmellding"}
                                    errorValue={{antallFiler: fileValidationErrors.filenames.size}}
                                />
                            )}
                            {Array.from(fileValidationErrors.errors).map((key, index) => {
                                return <InnerErrorMessage feilId={key} key={index} />;
                            })}
                        </div>
                    )}
                </div>
                {kanLasteOppVedlegg && (
                    <ButtonWrapper>
                        <Button
                            variant="primary"
                            disabled={isUploading}
                            onClick={(event) => {
                                logButtonOrLinkClick("Ettersendelse: Send vedlegg");
                                onSendClick(event);
                            }}
                        >
                            <FormattedMessage id="andre_vedlegg.send_knapp_tittel" />
                            {isUploading && <Loader />}
                        </Button>
                    </ButtonWrapper>
                )}
            </div>
            {errorMessage && (
                <ErrorMessage className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={errorMessage} />
                </ErrorMessage>
            )}
        </>
    );
};

export default EttersendelseView;
