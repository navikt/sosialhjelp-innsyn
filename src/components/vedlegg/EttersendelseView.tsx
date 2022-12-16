import React, {useEffect, useState} from "react";
import {Fil, InnsynsdataSti, KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
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
import {ErrorMessage as ErrorMessageLabel, ErrorMessage} from "../errors/ErrorMessage";
import InnerErrorMessage from "../oppgaver/ErrorMessage";
import {logInfoMessage} from "../../redux/innsynsdata/loggActions";

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

const StyledOuterErrorFrame = styled.div<{hasError?: boolean}>`
    padding: 1rem;
    border-radius: 2px;
    border-color: ${(props) =>
        props.hasError ? "var(--navds-alert-color-error-border)" : "var(--navds-semantic-color-border-inverted)"};
    border-width: 1px;
    border-style: solid;
`;

const StyledInnerErrorFrame = styled.div<{hasError?: boolean}>`
    padding: 1rem;
    background-color: ${(props) =>
        props.hasError
            ? "var(--navds-semantic-color-feedback-danger-background)"
            : "var(--navds-semantic-color-canvas-background)"};
    border-radius: 2px;
    border-color: ${(props) =>
        props.hasError ? "var(--navds-alert-color-error-border)" : "var(--navds-semantic-color-border-inverted)"};
    border-width: 1px;
    border-style: solid;
`;

const EttersendelseView: React.FC<Props> = ({restStatus}) => {
    const dispatch = useDispatch();
    const uuid = uuidv4();

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const [fileValidationErrors, setFileValidationErrors] = useState<FileValidationErrors | undefined>(undefined);
    const [concatenatedSizeOfFilesMessage, setConcatenatedSizeOfFilesMessage] = useState<string | undefined>(undefined);

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const [ettersendelseFiler, setEttersendelseFiler] = useState<Fil[]>([]);

    const [isUploading, setIsUploading] = useState(false);

    const [fileUploadingBackendFailed, setFileUploadingBackendFailed] = useState(false);

    const listeOverVedleggIderSomFeilet: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOpggaveIderSomFeilet
    );

    const listeOverVedleggIderSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletPaBackend
    );
    const listeOverOppgaveIderSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletIVirussjekkPaBackend
    );

    const opplastingFeilet = hasFilesWithErrorStatus(ettersendelseFiler);

    const vedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );

    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommuneResponse);

    useEffect(() => {
        if (ettersendelseFiler.length > 0) {
            window.addEventListener("beforeunload", alertUser);
        }
        return function unload() {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [ettersendelseFiler]);

    const visDetaljeFeiler: boolean =
        listeOverVedleggIderSomFeilet.includes(BACKEND_FEIL_ID) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        listeOverVedleggIderSomFeiletPaBackend.includes(BACKEND_FEIL_ID) ||
        listeOverOppgaveIderSomFeiletIVirussjekkPaBackend.includes(BACKEND_FEIL_ID) ||
        fileValidationErrors !== undefined ||
        errorMessage !== undefined ||
        fileUploadingBackendFailed;

    const visVedleggFeil: boolean =
        vedlegsOpplastingFeilet ||
        (fileValidationErrors !== undefined && fileValidationErrors.errors.size > 0) ||
        overMaksStorrelse ||
        fileUploadingBackendFailed;

    const onSendClick = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (!fiksDigisosId) {
            return;
        }
        setIsUploading(true);
        setErrorMessage(undefined);
        setOverMaksStorrelse(false);
        setFileUploadingBackendFailed(false);
        setConcatenatedSizeOfFilesMessage(undefined);
        const path = innsynsdataUrl(fiksDigisosId, InnsynsdataSti.VEDLEGG);
        let formData: any = undefined;

        dispatch(setFileUploadFailed(BACKEND_FEIL_ID, ettersendelseFiler.length === 0));
        if (ettersendelseFiler.length === 0) {
            setErrorMessage("vedlegg.minst_ett_vedlegg");
            fileUploadFailedEvent("vedlegg.minst_ett_vedlegg");
            setIsUploading(false);
        }

        const handleFileUploadFailedInBackend = (filerBackendResponse: Fil[]) => {
            setFileUploadingBackendFailed(true);
            const nyEttersendelseFiler = ettersendelseFiler.map((etterFiler) => {
                const overwritesPreviousFileStatus = filerBackendResponse.find(
                    (filerBack) => etterFiler.filnavn === filerBack.filnavn
                );
                return {...etterFiler, ...overwritesPreviousFileStatus};
            });
            setEttersendelseFiler(nyEttersendelseFiler);
            setIsUploading(false);
        };
        const handleFileWithVirus = () => {
            setErrorMessage("vedlegg.opplasting_backend_virus_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_backend_virus_feilmelding");
            setIsUploading(false);
        };
        const handleFileUploadFailed = () => {
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.VEDLEGG, false));
            setErrorMessage("vedlegg.opplasting_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_feilmelding");
            setIsUploading(false);
        };
        const onSuccessful = () => {
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.VEDLEGG, false));
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.HENDELSER, false));
            setEttersendelseFiler([]);
            setIsUploading(false);
        };

        const totalSizeOfAddedFiles = ettersendelseFiler.reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
            0
        );
        if (illegalCombinedFilesSize(totalSizeOfAddedFiles)) {
            setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            setOverMaksStorrelse(true);
        } else {
            if (!ettersendelseFiler || ettersendelseFiler.length === 0) {
                return;
            }
            try {
                formData = createFormDataWithVedleggFromFiler(ettersendelseFiler);
            } catch (e: any) {
                handleFileUploadFailed();
                logInfoMessage("Validering vedlegg feilet: " + e?.message);
                event.preventDefault();
                return;
            }
            onSendVedleggClicked(
                BACKEND_FEIL_ID,
                formData,
                ettersendelseFiler,
                path,
                handleFileWithVirus,
                handleFileUploadFailed,
                handleFileUploadFailedInBackend,
                onSuccessful
            );
        }
    };

    const onChange = (event: any) => {
        setErrorMessage(undefined);
        setFileValidationErrors(undefined);
        setConcatenatedSizeOfFilesMessage(undefined);
        setOverMaksStorrelse(false);
        setFileUploadingBackendFailed(false);
        dispatch(setFileUploadFailed(BACKEND_FEIL_ID, false));
        dispatch(setFileUploadFailedInBackend(BACKEND_FEIL_ID, false));
        dispatch(setFileUploadFailedVirusCheckInBackend(BACKEND_FEIL_ID, false));

        const files: FileList | null = event.currentTarget.files;
        if (files) {
            const opplastedeFiler = Array.from(files).map((file: File) => {
                return {filnavn: file.name, status: "INITIALISERT", file: file};
            });

            const validatedFile = validateFile(opplastedeFiler);

            if (validatedFile.errors.size) {
                setFileValidationErrors({errors: validatedFile.errors, filenames: validatedFile.filenames});
            }
            if (validatedFile.validFiles.length && validatedFile.errors.size === 0) {
                const totalSizeOfValidatedFiles = validatedFile.validFiles.reduce(
                    (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
                    0
                );

                if (illegalCombinedFilesSize(totalSizeOfValidatedFiles)) {
                    setOverMaksStorrelse(true);
                    setConcatenatedSizeOfFilesMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
                    fileUploadFailedEvent("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
                } else {
                    if (ettersendelseFiler[0]) {
                        setEttersendelseFiler(ettersendelseFiler.concat(validatedFile.validFiles));
                    } else {
                        setEttersendelseFiler(validatedFile.validFiles);
                    }
                }
            }
        }
        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    const onDeleteClick = (event: any, fil: Fil) => {
        setErrorMessage(undefined);
        setFileValidationErrors(undefined);
        setConcatenatedSizeOfFilesMessage(undefined);
        setOverMaksStorrelse(false);
        setFileUploadingBackendFailed(false);

        const remainingFiles = ettersendelseFiler.filter((filene) => filene.filnavn !== fil.filnavn);
        setEttersendelseFiler(remainingFiles);

        const totalFileSize = ettersendelseFiler.reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
            0
        );

        if (remainingFiles.find((etterfiler) => etterfiler.status !== "INITIALISERT")) {
            setFileUploadingBackendFailed(true);
        }

        if (illegalCombinedFilesSize(totalFileSize)) {
            setOverMaksStorrelse(true);
            setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            fileUploadFailedEvent("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            setIsUploading(true);
        } else {
            setOverMaksStorrelse(false);
            setIsUploading(false);
        }
        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    return (
        <>
            <DriftsmeldingVedlegg
                leserData={restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING}
            />
            <StyledOuterErrorFrame hasError={visDetaljeFeiler}>
                <StyledInnerErrorFrame hasError={visVedleggFeil}>
                    <TextAndButtonWrapper>
                        <div>
                            <Label as="p">
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

                    {ettersendelseFiler.map((fil: Fil, vedleggIndex: number) => (
                        <FileItemView
                            key={vedleggIndex}
                            fil={fil}
                            onDelete={(event: MouseEvent, fil) => {
                                onDeleteClick(event, fil);
                            }}
                        />
                    ))}
                    {fileValidationErrors && fileValidationErrors?.errors.size && !overMaksStorrelse && (
                        <div>
                            {fileValidationErrors.filenames.size === 1 ? (
                                <ErrorMessageTitle
                                    feilId={"vedlegg.ulovlig_en_fil_feilmelding"}
                                    errorValue={{filnavn: Array.from(fileValidationErrors.filenames)[0]}}
                                />
                            ) : (
                                <ErrorMessageTitle
                                    feilId={"vedlegg.ulovlig_flere_fil_feilmelding"}
                                    errorValue={{antallFiler: fileValidationErrors.filenames.size}}
                                />
                            )}
                            {Array.from(fileValidationErrors.errors).map((key, index) => {
                                return <InnerErrorMessage feilId={key} key={index} />;
                            })}
                        </div>
                    )}
                    {concatenatedSizeOfFilesMessage && (
                        <ErrorMessageLabel>
                            <FormattedMessage id={concatenatedSizeOfFilesMessage} />
                        </ErrorMessageLabel>
                    )}
                </StyledInnerErrorFrame>

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
                            {isUploading && !overMaksStorrelse && <Loader />}
                        </Button>
                    </ButtonWrapper>
                )}
            </StyledOuterErrorFrame>
            {errorMessage && (
                <ErrorMessage style={{marginBottom: "1rem", marginLeft: "1rem"}}>
                    <FormattedMessage id={errorMessage} />
                </ErrorMessage>
            )}
        </>
    );
};

export default EttersendelseView;
