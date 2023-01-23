import React, {useEffect, useState} from "react";
import {Fil, InnsynsdataSti} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {REST_STATUS} from "../../utils/restUtils";
import {
    createFormDataWithVedleggFromFiler,
    hasFilesWithErrorStatus,
    illegalCombinedFilesSize,
} from "../../utils/vedleggUtils";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";
import {logInfoMessage} from "../../redux/innsynsdata/loggActions";
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
import useKommune from "../../hooks/useKommune";
import {useQueryClient} from "@tanstack/react-query";
import {FileValidationErrors} from "../oppgaver/DokumentasjonkravElementView";
import {validateFile} from "../oppgaver/validateFile";
import {ErrorMessageTitle} from "../oppgaver/ErrorMessageTitleNew";
import {ErrorMessage as ErrorMessageLabel, ErrorMessage} from "../errors/ErrorMessage";
import InnerErrorMessage from "../oppgaver/ErrorMessage";
import {getHentHendelserQueryKey} from "../../generated/hendelse-controller/hendelse-controller";

/*
 * Siden det er ikke noe form for oppgaveId så blir BACKEND_FEIL_ID
 * brukt sånnn at man slipper å lage egne actions
 * og reducere for denne ene komponenten.
 */
const BACKEND_FEIL_ID = "backendFeilId";

interface Props {
    restStatus: REST_STATUS;
}

const StyledOuterFrame = styled.div<{hasError?: boolean}>`
    padding: 1rem;
    border-radius: 2px;
    border-color: ${(props) => (props.hasError ? "var(--a-red-500)" : "var(--a-gray-200)")};
    border-width: 1px;
    border-style: solid;
`;

const StyledInnerFrame = styled.div<{hasError?: boolean}>`
    padding: 1rem;
    border-radius: 2px;
    background-color: ${(props) => (props.hasError ? "var(--a-red-50)" : "var(--a-gray-200)")};
    border-color: ${(props) => (props.hasError ? "var(--a-red-500)" : "var(--a-gray-300)")};
    border-width: 1px;
    border-style: solid;
`;

const ButtonWrapper = styled.div`
    margin-top: 1rem;
`;

const EttersendelseView: React.FC<Props> = ({restStatus}) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const uuid = uuidv4();

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const filer: Fil[] = useSelector((state: InnsynAppState) => state.innsynsdata.ettersendelse.filer);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const [fileValidationErrors, setFileValidationErrors] = useState<FileValidationErrors | undefined>(undefined);

    const [concatenatedSizeOfFilesMessage, setConcatenatedSizeOfFilesMessage] = useState<string | undefined>(undefined);

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

    const [ettersendelserFiler, setEttersendelserFiler] = useState<Fil[]>([]);

    const [isUploading, setIsUploading] = useState(false);

    const [fileUploadingBackendFailed, setFileUploadingBackendFailed] = useState(false);

    const listeOverVedleggIderSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletPaBackend
    );
    const listeOverOppgaveIderSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletIVirussjekkPaBackend
    );

    useEffect(() => {
        if (ettersendelserFiler.length > 0) {
            window.addEventListener("beforeunload", alertUser);
        }
        return function unload() {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [ettersendelserFiler]);

    const alertUser = (event: any) => {
        event.preventDefault();
        event.returnValue = "";
    };

    const opplastingFeilet = hasFilesWithErrorStatus(filer);

    const vedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );

    const {kommune} = useKommune();
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommune);

    const visDetaljeFeiler: boolean =
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        listeOverVedleggIderSomFeiletPaBackend.includes(BACKEND_FEIL_ID) ||
        listeOverOppgaveIderSomFeiletIVirussjekkPaBackend.includes(BACKEND_FEIL_ID) ||
        fileValidationErrors !== undefined ||
        errorMessage !== undefined ||
        fileUploadingBackendFailed;

    const visVedleggFeil: boolean =
        vedlegsOpplastingFeilet ||
        (fileValidationErrors !== undefined && !!fileValidationErrors.errors.size) ||
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

        if (ettersendelserFiler.length === 0) {
            setErrorMessage("vedlegg.minst_ett_vedlegg");
            fileUploadFailedEvent("vedlegg.minst_ett_vedlegg");
            setIsUploading(false);
        }

        const handleFileUploadFailedInBackend = (filerBackendResponse: Fil[]) => {
            setFileUploadingBackendFailed(true);
            const nyEttersendelseFiler = ettersendelserFiler.map((etterFiler) => {
                const overwritesPreviousFileStatus = filerBackendResponse.find(
                    (filerBack) => etterFiler.filnavn === filerBack.filnavn
                );
                return {...etterFiler, ...overwritesPreviousFileStatus};
            });
            setEttersendelserFiler(nyEttersendelseFiler);
            setIsUploading(false);
        };
        const handleFileWithVirus = () => {
            setErrorMessage("vedlegg.opplasting_backend_virus_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_backend_virus_feilmelding");
            setIsUploading(false);
        };
        const handleFileUploadFailed = () => {
            dispatch(hentInnsynsdata(BACKEND_FEIL_ID, InnsynsdataSti.VEDLEGG, false));
            setErrorMessage("vedlegg.opplasting_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_feilmelding");
            setIsUploading(false);
        };
        const onSuccessful = () => {
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.VEDLEGG, false));
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.HENDELSER, false));
            setEttersendelserFiler([]);
            setIsUploading(false);
            queryClient.refetchQueries(getHentHendelserQueryKey(fiksDigisosId));
        };

        const totalSizeOfAddedFiles = ettersendelserFiler.reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file?.size : 0),
            0
        );
        if (illegalCombinedFilesSize(totalSizeOfAddedFiles)) {
            setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            setOverMaksStorrelse(true);
        } else {
            if (!ettersendelserFiler || ettersendelserFiler.length === 0) {
                return;
            }
            try {
                formData = createFormDataWithVedleggFromFiler(ettersendelserFiler);
            } catch (e: any) {
                handleFileUploadFailed();
                logInfoMessage("Validering vedlegg feilet: " + e?.message);
                event.preventDefault();
                return;
            }
            onSendVedleggClicked(
                BACKEND_FEIL_ID,
                formData,
                ettersendelserFiler,
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
                    if (ettersendelserFiler[0]) {
                        setEttersendelserFiler(ettersendelserFiler.concat(validatedFile.validFiles));
                    } else {
                        setEttersendelserFiler(validatedFile.validFiles);
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
        setOverMaksStorrelse(false);
        setErrorMessage(undefined);
        setFileValidationErrors(undefined);
        setConcatenatedSizeOfFilesMessage(undefined);
        setOverMaksStorrelse(false);
        setFileUploadingBackendFailed(false);

        const remainingFiles = ettersendelserFiler.filter((filene) => filene.filnavn !== fil.filnavn);
        setEttersendelserFiler(remainingFiles);

        const totalSizeOfFiles = ettersendelserFiler.reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
            0
        );

        if (remainingFiles.find((etterFiler) => etterFiler.status !== "INITIALISERT")) {
            setFileUploadingBackendFailed(true);
        }
        if (illegalCombinedFilesSize(totalSizeOfFiles)) {
            setOverMaksStorrelse(true);
            setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_filer");
            fileUploadFailedEvent("vedlegg.ulovlig_storrelse_av_alle_filer");
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
            <StyledOuterFrame hasError={visDetaljeFeiler}>
                <StyledInnerFrame hasError={visVedleggFeil}>
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

                    {ettersendelserFiler.map((fil: Fil, vedleggIndex: number) => (
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
                </StyledInnerFrame>
                {kanLasteOppVedlegg && (
                    <ButtonWrapper>
                        <Button
                            variant="primary"
                            disabled={isUploading}
                            onClick={(event: any) => {
                                logButtonOrLinkClick("Ettersendelse: Send vedlegg");
                                onSendClick(event);
                            }}
                        >
                            <FormattedMessage id="andre_vedlegg.send_knapp_tittel" />
                            {isUploading && !overMaksStorrelse && <Loader />}
                        </Button>
                    </ButtonWrapper>
                )}
            </StyledOuterFrame>
            {errorMessage && (
                <ErrorMessage style={{marginBottom: "1rem", marginLeft: "1rem"}}>
                    <FormattedMessage id={errorMessage} />
                </ErrorMessage>
            )}
        </>
    );
};

export default EttersendelseView;
