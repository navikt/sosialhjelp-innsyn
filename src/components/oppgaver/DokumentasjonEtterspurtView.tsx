import React, {useState} from "react";
import {DokumentasjonEtterspurt, Fil, InnsynsdataSti, settRestStatus} from "../../redux/innsynsdata/innsynsdataReducer";
import {useDispatch, useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";
import {InnsynAppState} from "../../redux/reduxTypes";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {antallDagerEtterFrist} from "./Oppgaver";
import {formatDato} from "../../utils/formatting";
import {
    createFormDataWithVedleggFromOppgaver,
    getVisningstekster,
    hasNotAddedFiles,
    illegalCombinedFilesSize,
    oppgaveHasFilesWithError,
} from "../../utils/vedleggUtils";
import {REST_STATUS} from "../../utils/restUtils";
import DokumentasjonEtterspurtElementView from "./DokumentasjonEtterspurtElementView";
import {
    hentInnsynsdata,
    hentOppgaveMedId,
    innsynsdataUrl,
    setFileUploadFailed,
    setFileUploadFailedInBackend,
    setFileUploadFailedVirusCheckInBackend,
} from "../../redux/innsynsdata/innsynsDataActions";
import {logInfoMessage} from "../../redux/innsynsdata/loggActions";
import {
    fileUploadFailedEvent,
    logButtonOrLinkClick,
    logDuplicationsOfUploadedAttachmentsForDokEtterspurt,
} from "../../utils/amplitude";
import {BodyShort, Button, Loader} from "@navikt/ds-react";
import {ErrorMessage} from "../errors/ErrorMessage";
import styled from "styled-components";
import useKommune from "../../hooks/useKommune";
import {useQueryClient} from "@tanstack/react-query";
import {onSendVedleggClicked} from "./onSendVedleggClickedNew";

interface Props {
    dokumentasjonEtterspurt: DokumentasjonEtterspurt;
    oppgaverErFraInnsyn: boolean;
    oppgaveIndex: any;
}

const StyledInnerFrame = styled.div<{hasError?: boolean}>`
    padding: 1rem;
    border.radius: 2px;
    border-color: ${(props) => (props.hasError ? "var(--a-red-500)" : "var(--a-gray-300)")};
    border-width: 1px;
    border-style: solid;
`;

const StyledOuterFrame = styled.div`
    margin-top: 1rem;
`;

const ButtonWrapper = styled.div`
    margin-top: 1rem;
`;

export interface DokumentasjonEtterspurtFiler {
    [key: string]: Fil[];
}

export const deleteReferenceFromDokumentasjonEtterspurtFiler = (
    dokumentasjonEtterspurtFiler: DokumentasjonEtterspurtFiler,
    reference: string
) => {
    return Object.keys(dokumentasjonEtterspurtFiler).reduce(
        (updated, currentReference) =>
            currentReference === reference
                ? updated
                : {
                      ...updated,
                      [currentReference]: dokumentasjonEtterspurtFiler[currentReference],
                  },
        {}
    );
};

const DokumentasjonEtterspurtView: React.FC<Props> = ({dokumentasjonEtterspurt, oppgaverErFraInnsyn, oppgaveIndex}) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [dokumentasjonEtterspurtFiler, setDokumentasjonEtterspurtFiler] = useState<DokumentasjonEtterspurtFiler>({});
    const [filesHasErrors, setFilesHasErrors] = useState(false);
    const [fileUploadingBackendFailed, setFileUploadingBackendFailed] = useState(false);

    logDuplicationsOfUploadedAttachmentsForDokEtterspurt(dokumentasjonEtterspurt, oppgaveIndex);

    const listeOverDokumentasjonEtterspurtIderSomFeilet: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOpggaveIderSomFeilet
    );
    const listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletPaBackend
    );
    const listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletIVirussjekkPaBackend
    );

    const {kommune, isLoading} = useKommune();
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommune);

    const opplastingFeilet = oppgaveHasFilesWithError(dokumentasjonEtterspurt.oppgaveElementer);

    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(dokumentasjonEtterspurt.innsendelsesfrist!!));

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const visDokumentasjonEtterspurtDetaljeFeiler: boolean =
        listeOverDokumentasjonEtterspurtIderSomFeilet.includes(dokumentasjonEtterspurt.oppgaveId) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        errorMessage !== undefined ||
        filesHasErrors ||
        fileUploadingBackendFailed ||
        listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend.includes(dokumentasjonEtterspurt.oppgaveId) ||
        listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend.includes(dokumentasjonEtterspurt.oppgaveId);

    const onSendClicked = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (!fiksDigisosId || !dokumentasjonEtterspurt) {
            return;
        }
        setIsUploading(true);
        setErrorMessage(undefined);
        setOverMaksStorrelse(false);
        setFileUploadingBackendFailed(false);
        const path = innsynsdataUrl(fiksDigisosId, InnsynsdataSti.VEDLEGG);
        let formData: any = undefined;

        const noFilesAdded = hasNotAddedFiles(dokumentasjonEtterspurt);
        dispatch(
            setFileUploadFailed(
                dokumentasjonEtterspurt.oppgaveId,
                Object.keys(dokumentasjonEtterspurtFiler).length === 0
            )
        );

        if (Object.keys(dokumentasjonEtterspurtFiler).length === 0) {
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            logInfoMessage("Validering vedlegg feilet: Ingen filer valgt");
            setErrorMessage("vedlegg.minst_ett_vedlegg");
            setIsUploading(false);
            event.preventDefault();
            return;
        }
        const handleFileUploadFailedInBackend = (filerBackendResponse: Fil[], reference: string) => {
            setFileUploadingBackendFailed(true);
            const newDokumentasjonEtterspurt = {...dokumentasjonEtterspurtFiler};
            newDokumentasjonEtterspurt[reference] = dokumentasjonEtterspurtFiler[reference].map((etterspurtFiler) => {
                const overWritesPreviousFileStatus = filerBackendResponse.find(
                    (filerBack) => etterspurtFiler.filnavn === filerBack.filnavn
                );
                return {...etterspurtFiler, ...overWritesPreviousFileStatus};
            });
            setDokumentasjonEtterspurtFiler(newDokumentasjonEtterspurt);
            setIsUploading(false);
        };
        const handleFileWithVirus = () => {
            setErrorMessage("vedlegg.opplasting_backend_virus_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_backend_virus_feilmelding");
            setIsUploading(false);
            dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, false));
            dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonEtterspurt.oppgaveId, true));
        };
        const handleFileUploadFailed = () => {
            setErrorMessage("vedlegg.opplasting_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_feilmelding");
            setIsUploading(false);
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, true));
        };
        const onSuccessful = (hendelseReferanse: string) => {
            dispatch(hentOppgaveMedId(fiksDigisosId, InnsynsdataSti.OPPGAVER, dokumentasjonEtterspurt.oppgaveId));
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.VEDLEGG, false));
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.HENDELSER, false));

            setDokumentasjonEtterspurtFiler(
                deleteReferenceFromDokumentasjonEtterspurtFiler(dokumentasjonEtterspurtFiler, hendelseReferanse)
            );
            setIsUploading(false);
        };
        dokumentasjonEtterspurt.oppgaveElementer.forEach((dokumentasjonEtterspurtElement) => {
            const reference = dokumentasjonEtterspurtElement.hendelsereferanse ?? "";
            const filer = dokumentasjonEtterspurtFiler[reference];
            if (!filer || filer.length === 0) {
                return;
            }

            const totalSizeOfAddedFiles = filer.reduce(
                (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
                0
            );

            if (illegalCombinedFilesSize(totalSizeOfAddedFiles)) {
                setOverMaksStorrelse(true);
                setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            } else {
                try {
                    formData = createFormDataWithVedleggFromOppgaver(
                        dokumentasjonEtterspurtElement,
                        filer,
                        dokumentasjonEtterspurt.innsendelsesfrist
                    );
                } catch (e: any) {
                    handleFileUploadFailed();
                    logInfoMessage("Validering vedlegg feilet: " + e?.message);
                    event.preventDefault();
                    return;
                }
                onSendVedleggClicked(
                    reference,
                    formData,
                    filer,
                    path,
                    handleFileWithVirus,
                    handleFileUploadFailed,
                    handleFileUploadFailedInBackend,
                    onSuccessful
                );
            }
        });
    };

    const onAddFileChange = (event: any, hendelseReferanse: string, validFiles: Fil[]) => {
        setFilesHasErrors(false);
        setOverMaksStorrelse(false);
        setIsUploading(false);
        setErrorMessage(undefined);
        setFileUploadingBackendFailed(false);
        dispatch(setFileUploadFailed(dokumentasjonEtterspurt.oppgaveId, false));
        dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, false));
        dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonEtterspurt.oppgaveId, false));

        if (validFiles.length) {
            const totalSizeOfValidatedFiles = validFiles.reduce(
                (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
                0
            );

            if (illegalCombinedFilesSize(totalSizeOfValidatedFiles)) {
                setOverMaksStorrelse(true);
                setIsUploading(true);
                fileUploadFailedEvent("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            } else {
                const newDokumentasjonEtterspurt = {...dokumentasjonEtterspurtFiler};
                if (newDokumentasjonEtterspurt[hendelseReferanse]) {
                    newDokumentasjonEtterspurt[hendelseReferanse] =
                        newDokumentasjonEtterspurt[hendelseReferanse].concat(validFiles);
                } else {
                    newDokumentasjonEtterspurt[hendelseReferanse] = validFiles;
                }
                setDokumentasjonEtterspurtFiler(newDokumentasjonEtterspurt);
            }
        }

        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    const onDeleteClick = (event: any, hendelseReferanse: string, fil: Fil) => {
        setFileUploadingBackendFailed(false);
        setErrorMessage(undefined);
        setOverMaksStorrelse(false);
        setIsUploading(false);

        if (hendelseReferanse !== "" && fil) {
            const newDokumentasjonEtterspurt = {...dokumentasjonEtterspurtFiler};
            if (newDokumentasjonEtterspurt[hendelseReferanse]) {
                const remainingFiles = newDokumentasjonEtterspurt[hendelseReferanse].filter(
                    (dokEtterspurt) => dokEtterspurt.file !== fil.file
                );

                if (remainingFiles.length) {
                    newDokumentasjonEtterspurt[hendelseReferanse] = remainingFiles;
                } else {
                    delete newDokumentasjonEtterspurt[hendelseReferanse];
                }
            }
            setDokumentasjonEtterspurtFiler(newDokumentasjonEtterspurt);

            if (
                newDokumentasjonEtterspurt[hendelseReferanse].find(
                    (dokEtterspurt) => dokEtterspurt.status !== "INITIALISERT"
                )
            ) {
                setFileUploadingBackendFailed(true);
            }
        }

        const totalFileSize = dokumentasjonEtterspurtFiler[hendelseReferanse].reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
            0
        );
        if (illegalCombinedFilesSize(totalFileSize)) {
            setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            setOverMaksStorrelse(true);
            setIsUploading(true);
        }
    };

    return (
        <StyledOuterFrame>
            <StyledInnerFrame hasError={visDokumentasjonEtterspurtDetaljeFeiler}>
                {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert <= 0 && (
                    <BodyShort spacing>
                        <FormattedMessage
                            id="oppgaver.innsendelsesfrist"
                            values={{innsendelsesfrist: formatDato(dokumentasjonEtterspurt.innsendelsesfrist!)}}
                        />
                    </BodyShort>
                )}
                {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert > 0 && (
                    <BodyShort spacing>
                        <FormattedMessage
                            id="oppgaver.innsendelsesfrist_passert"
                            values={{innsendelsesfrist: formatDato(dokumentasjonEtterspurt.innsendelsesfrist!)}}
                        />
                    </BodyShort>
                )}
                {dokumentasjonEtterspurt.oppgaveElementer.map((oppgaveElement, oppgaveElementIndex) => {
                    let {typeTekst, tilleggsinfoTekst} = getVisningstekster(
                        oppgaveElement.dokumenttype,
                        oppgaveElement.tilleggsinformasjon
                    );

                    return (
                        <DokumentasjonEtterspurtElementView
                            key={oppgaveElementIndex}
                            tittel={typeTekst}
                            beskrivelse={tilleggsinfoTekst}
                            oppgaveElement={oppgaveElement}
                            hendelseReferanse={oppgaveElement.hendelsereferanse ?? ""}
                            onDelete={onDeleteClick}
                            onAddFileChange={onAddFileChange}
                            setFilesHasErrors={setFilesHasErrors}
                            setOverMaksStorrelse={setOverMaksStorrelse}
                            overMaksStorrelse={overMaksStorrelse}
                            fileUploadingBackendFailed={fileUploadingBackendFailed}
                            setFileUploadingBackendFailed={setFileUploadingBackendFailed}
                            filer={dokumentasjonEtterspurtFiler[oppgaveElement.hendelsereferanse ?? ""] ?? []}
                        />
                    );
                })}
                {listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend.includes(dokumentasjonEtterspurt.oppgaveId) && (
                    <ErrorMessage className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                        <FormattedMessage id={"vedlegg.opplasting_backend_feilmelding"} />
                    </ErrorMessage>
                )}
                {kanLasteOppVedlegg && (
                    <ButtonWrapper>
                        <Button
                            variant="primary"
                            disabled={isUploading}
                            onClick={(event) => {
                                logButtonOrLinkClick("Dokumentasjon etterspurt: Send vedlegg");
                                onSendClicked(event);
                            }}
                            iconPosition="right"
                            icon={isUploading && !overMaksStorrelse && <Loader />}
                        >
                            <FormattedMessage id="oppgaver.send_knapp_tittel" />
                        </Button>
                    </ButtonWrapper>
                )}
            </StyledInnerFrame>
            {errorMessage && (
                <ErrorMessage style={{marginBottom: "1rem", marginLeft: "1rem"}}>
                    <FormattedMessage id={errorMessage} />
                </ErrorMessage>
            )}
        </StyledOuterFrame>
    );
};

export default DokumentasjonEtterspurtView;
