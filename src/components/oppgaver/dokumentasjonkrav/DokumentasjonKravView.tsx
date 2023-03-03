import React, {useState} from "react";
import {DokumentasjonKrav, Fil, InnsynsdataSti} from "../../../redux/innsynsdata/innsynsdataReducer";
import {
    createFormDataWithVedleggFromDokumentasjonkrav,
    dokumentasjonkravHasFilesWithError,
    illegalCombinedFilesSize,
} from "../../../utils/vedleggUtils";

import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../../redux/reduxTypes";
import {isFileUploadAllowed} from "../../driftsmelding/DriftsmeldingUtilities";
import {onSendVedleggClicked} from "../onSendVedleggClickedNew";
import {FormattedMessage} from "react-intl";
import {
    hentDokumentasjonkravMedId,
    hentInnsynsdata,
    innsynsdataUrl,
} from "../../../redux/innsynsdata/innsynsDataActions";
import {fileUploadFailedEvent} from "../../../utils/amplitude";
import {Button, Loader} from "@navikt/ds-react";
import {ErrorMessage} from "../../errors/ErrorMessage";
import styled from "styled-components";
import useKommune from "../../../hooks/useKommune";
import {getHentHendelserQueryKey} from "../../../generated/hendelse-controller/hendelse-controller";
import {useQueryClient} from "@tanstack/react-query";
import {logInfoMessage} from "../../../redux/innsynsdata/loggActions";
import DokumentasjonkravElementView from "./DokumentasjonkravElementView";
import InnsendelsesFrist from "../InnsendelsesFrist";

interface Props {
    dokumentasjonkrav: DokumentasjonKrav;
}

export interface DokumentasjonKravFiler {
    [key: string]: Fil[];
}

export const deleteReferenceFromDokumentasjonkravFiler = (
    dokumentasjonkravFiler: DokumentasjonKravFiler,
    reference: string
) => {
    return Object.keys(dokumentasjonkravFiler).reduce(
        (updated, currentReference) =>
            currentReference === reference
                ? updated
                : {
                      ...updated,
                      [currentReference]: dokumentasjonkravFiler[currentReference],
                  },
        {}
    );
};

const StyledInnerFrame = styled.div<{hasError?: boolean}>`
    padding: 1rem;
    border-radius: 2px;
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

const DokumentasjonKravView: React.FC<Props> = ({dokumentasjonkrav}) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [dokumentasjonkravFiler, setDokumentasjonkravFiler] = useState<DokumentasjonKravFiler>({});
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [isUploading, setIsUploading] = useState(false);

    const dokumentasjonkravReferanserSomFeilet: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.dokumentasjonkravReferanserSomFeilet
    );
    const dokumentasjonkravReferanserSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.dokumentasjonkravReferanserSomFeiletPaBackend
    );
    const dokumentasjonkravReferanserSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.dokumentasjonkravReferanserSomFeiletIVirussjekkPaBackend
    );

    const {kommune} = useKommune();
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommune);

    const opplastingFeilet = dokumentasjonkravHasFilesWithError(dokumentasjonkrav.dokumentasjonkravElementer);

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const [filesHasErrors, setFilesHasErrors] = useState(false);

    const [fileUploadingBackendFailed, setFileUploadingBackendFailed] = useState(false);

    const includesReferense = (feilReferanse: string[]) => {
        dokumentasjonkrav.dokumentasjonkravElementer.filter((dokkrav) => {
            if (dokkrav.dokumentasjonkravReferanse) {
                return feilReferanse.includes(dokkrav.dokumentasjonkravReferanse);
            }
            return false;
        });
        return false;
    };

    const onSendClicked = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (!fiksDigisosId || !dokumentasjonkrav) {
            return;
        }
        setIsUploading(true);
        setErrorMessage(undefined);
        setOverMaksStorrelse(false);
        setFileUploadingBackendFailed(false);
        const path = innsynsdataUrl(fiksDigisosId, InnsynsdataSti.VEDLEGG);
        let formData: any = undefined;

        if (Object.keys(dokumentasjonkravFiler).length === 0) {
            setErrorMessage("vedlegg.minst_ett_vedlegg");
            fileUploadFailedEvent("vedlegg.minst_ett_vedlegg");
            setIsUploading(false);
        }

        const handleFileUploadFailedInBackend = (fileBackendResponse: Fil[], reference: string) => {
            setFileUploadingBackendFailed(true);
            const newDokumentasjonkrav = {...dokumentasjonkravFiler};
            newDokumentasjonkrav[reference] = dokumentasjonkravFiler[reference].map((kravFiler) => {
                const overwritePreviousFileStatus = fileBackendResponse.find(
                    (filerBack) => kravFiler.filnavn === filerBack.filnavn
                );
                return {...kravFiler, ...overwritePreviousFileStatus};
            });
            setDokumentasjonkravFiler(newDokumentasjonkrav);
            setIsUploading(false);
        };
        const handleFileWithVirus = () => {
            setErrorMessage("vedlegg.opplasting_backend_virus_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_backend_virus_feilmelding");
            setIsUploading(false);
        };
        const handleFileUploadFailed = () => {
            dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SAKSSTATUS, false));
            setErrorMessage("vedlegg.opplasting_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_feilmelding");
            setIsUploading(false);
        };
        const onSuccessful = (reference: string) => {
            dispatch(
                hentDokumentasjonkravMedId(
                    fiksDigisosId,
                    InnsynsdataSti.DOKUMENTASJONKRAV,
                    dokumentasjonkrav.dokumentasjonkravId
                )
            );
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.VEDLEGG, false));
            queryClient.refetchQueries(getHentHendelserQueryKey(fiksDigisosId));

            setDokumentasjonkravFiler(deleteReferenceFromDokumentasjonkravFiler(dokumentasjonkravFiler, reference));
            setIsUploading(false);
        };
        dokumentasjonkrav.dokumentasjonkravElementer.forEach((dokumentasjonkravElement) => {
            const reference = dokumentasjonkravElement.dokumentasjonkravReferanse ?? "";
            const filer = dokumentasjonkravFiler[reference];
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
                    formData = createFormDataWithVedleggFromDokumentasjonkrav(
                        dokumentasjonkravElement,
                        filer,
                        dokumentasjonkrav.frist
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

    const onChange = (event: any, dokumentasjonkravReferanse: string, validFiles: Fil[]) => {
        setErrorMessage(undefined);
        setFilesHasErrors(false);
        setOverMaksStorrelse(false);
        setIsUploading(false);
        setFileUploadingBackendFailed(false);

        if (validFiles.length) {
            const totalFileSize = validFiles.reduce(
                (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
                0
            );

            if (illegalCombinedFilesSize(totalFileSize)) {
                setOverMaksStorrelse(true);
                fileUploadFailedEvent("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            } else {
                const newDokumentasjonkrav = {...dokumentasjonkravFiler};
                if (newDokumentasjonkrav[dokumentasjonkravReferanse]) {
                    newDokumentasjonkrav[dokumentasjonkravReferanse] =
                        newDokumentasjonkrav[dokumentasjonkravReferanse].concat(validFiles);
                } else {
                    newDokumentasjonkrav[dokumentasjonkravReferanse] = validFiles;
                }
                setDokumentasjonkravFiler(newDokumentasjonkrav);
            }
        }

        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    const onDeleteClick = (event: any, dokumentasjonkravReferanse: string, fil: Fil) => {
        setErrorMessage(undefined);
        setFileUploadingBackendFailed(false);
        setOverMaksStorrelse(false);
        setIsUploading(false);

        if (dokumentasjonkravReferanse !== "" && fil) {
            const newDokumentasjonkrav = {...dokumentasjonkravFiler};
            if (newDokumentasjonkrav[dokumentasjonkravReferanse]) {
                const remainingFiles = newDokumentasjonkrav[dokumentasjonkravReferanse].filter(
                    (dokkrav) => dokkrav.file !== fil.file
                );

                if (remainingFiles.length) {
                    newDokumentasjonkrav[dokumentasjonkravReferanse] = remainingFiles;
                    setDokumentasjonkravFiler(newDokumentasjonkrav);
                } else {
                    setDokumentasjonkravFiler(
                        deleteReferenceFromDokumentasjonkravFiler(dokumentasjonkravFiler, dokumentasjonkravReferanse)
                    );
                }

                if (
                    remainingFiles.length > 0 &&
                    newDokumentasjonkrav[dokumentasjonkravReferanse].find(
                        (dokkrav) => dokkrav.status !== "INITIALISERT"
                    )
                ) {
                    setFileUploadingBackendFailed(true);
                }
            }
        }

        const totalFileSize = dokumentasjonkravFiler[dokumentasjonkravReferanse].reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
            0
        );

        if (illegalCombinedFilesSize(totalFileSize)) {
            setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            setOverMaksStorrelse(true);
            setIsUploading(true);
        }
    };

    const visDokumentasjonkravDetaljerFeiler: boolean =
        includesReferense(dokumentasjonkravReferanserSomFeilet) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        errorMessage !== undefined ||
        filesHasErrors ||
        fileUploadingBackendFailed ||
        includesReferense(dokumentasjonkravReferanserSomFeiletPaBackend) ||
        includesReferense(dokumentasjonkravReferanserSomFeiletIVirussjekkPaBackend);

    return (
        <StyledOuterFrame>
            <StyledInnerFrame hasError={visDokumentasjonkravDetaljerFeiler}>
                <InnsendelsesFrist frist={dokumentasjonkrav.frist} />
                <ul>
                    {dokumentasjonkrav.dokumentasjonkravElementer.map(
                        (dokumentasjonkravElement, dokumentasjonkravElementIndex) => {
                            return (
                                <li>
                                    <DokumentasjonkravElementView
                                        key={dokumentasjonkravElementIndex}
                                        dokumentasjonkravElement={dokumentasjonkravElement}
                                        onChange={onChange}
                                        onDelete={onDeleteClick}
                                        setFilesHasErrors={setFilesHasErrors}
                                        setOverMaksStorrelse={setOverMaksStorrelse}
                                        overMaksStorrelse={overMaksStorrelse}
                                        fileUploadingBackendFailed={fileUploadingBackendFailed}
                                        setFileUploadingBackendFailed={setFileUploadingBackendFailed}
                                        filer={
                                            dokumentasjonkravFiler[
                                                dokumentasjonkravElement.dokumentasjonkravReferanse ?? ""
                                            ] ?? []
                                        }
                                    />
                                </li>
                            );
                        }
                    )}
                </ul>
                {kanLasteOppVedlegg && (
                    <ButtonWrapper>
                        <Button
                            variant="primary"
                            disabled={isUploading}
                            onClick={(event) => {
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

export default DokumentasjonKravView;
