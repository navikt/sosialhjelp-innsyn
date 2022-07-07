import React, {useState} from "react";
import {
    DokumentasjonKrav,
    Fil,
    InnsynsdataSti,
    KommuneResponse,
    settRestStatus,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {
    createFormDataWithVedleggFromDokumentasjonkrav,
    dokumentasjonkravHasFilesWithError,
    illegalCombinedFilesSize,
} from "../../utils/vedleggUtils";
import DokumentasjonkravElementView from "./DokumentasjonkravElementView";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {antallDagerEtterFrist} from "./Oppgaver";
import {onSendVedleggClicked} from "./onSendVedleggClickedNew";
import {FormattedMessage} from "react-intl";
import {
    hentDokumentasjonkravMedId,
    hentInnsynsdata,
    innsynsdataUrl,
    setFileUploadFailed,
    setFileUploadFailedInBackend,
    setFileUploadFailedVirusCheckInBackend,
} from "../../redux/innsynsdata/innsynsDataActions";
import {formatDato} from "../../utils/formatting";
import {fileUploadFailedEvent} from "../../utils/amplitude";
import {BodyShort, Button, Loader} from "@navikt/ds-react";
import {ErrorMessage} from "../errors/ErrorMessage";
import styled from "styled-components";
import {REST_STATUS} from "../../utils/restUtils";

interface Props {
    dokumentasjonkrav: DokumentasjonKrav;
    dokumentasjonkravIndex: number;
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

const ButtonWrapper = styled.div`
    margin-top: 1rem;
`;

const DokumentasjonKravView: React.FC<Props> = ({dokumentasjonkrav, dokumentasjonkravIndex}) => {
    const dispatch = useDispatch();
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

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommuneResponse);

    const opplastingFeilet = dokumentasjonkravHasFilesWithError(dokumentasjonkrav.dokumentasjonkravElementer);

    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(dokumentasjonkrav.frist!!));

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

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
        if (!fiksDigisosId || overMaksStorrelse) {
            return;
        }
        setIsUploading(true);
        setErrorMessage(undefined);
        const path = innsynsdataUrl(fiksDigisosId, InnsynsdataSti.VEDLEGG);

        dispatch(
            setFileUploadFailed(dokumentasjonkrav.dokumentasjonkravId, Object.keys(dokumentasjonkravFiler).length === 0)
        );

        if (Object.keys(dokumentasjonkravFiler).length === 0) {
            setErrorMessage("vedlegg.minst_ett_vedlegg");
            fileUploadFailedEvent("vedlegg.minst_ett_vedlegg");
            setIsUploading(false);
        }

        const handleFileWithVirus = () => {
            setErrorMessage("vedlegg.opplasting_backend_virus_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_backend_virus_feilmelding");
            setIsUploading(false);
            dispatch(setFileUploadFailedInBackend(dokumentasjonkrav.dokumentasjonkravId, false));
            dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonkrav.dokumentasjonkravId, true));
        };
        const handleFileUploadFailed = () => {
            dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SAKSSTATUS, false));
            setErrorMessage("vedlegg.opplasting_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_feilmelding");
            setIsUploading(false);
            dispatch(settRestStatus(InnsynsdataSti.DOKUMENTASJONKRAV, REST_STATUS.FEILET));
            dispatch(setFileUploadFailedInBackend(dokumentasjonkrav.dokumentasjonkravId, true));
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
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.HENDELSER, false));

            setDokumentasjonkravFiler(deleteReferenceFromDokumentasjonkravFiler(dokumentasjonkravFiler, reference));
            setIsUploading(false);
        };
        dokumentasjonkrav.dokumentasjonkravElementer.forEach((dokumentasjonkravElement) => {
            const reference = dokumentasjonkravElement.dokumentasjonkravReferanse ?? "";
            const filer = dokumentasjonkravFiler[reference];
            if (!filer || filer.length === 0) {
                return;
            }
            const formData = createFormDataWithVedleggFromDokumentasjonkrav(
                dokumentasjonkravElement,
                filer,
                dokumentasjonkrav.frist
            );
            onSendVedleggClicked(
                reference,
                formData,
                filer,
                path,
                handleFileWithVirus,
                handleFileUploadFailed,
                onSuccessful
            );
        });
    };

    const onChange = (event: any, dokumentasjonkravReferanse: string, validFiles: Fil[]) => {
        setErrorMessage(undefined);
        dispatch(setFileUploadFailed(dokumentasjonkrav.dokumentasjonkravId, false));
        dispatch(setFileUploadFailedInBackend(dokumentasjonkrav.dokumentasjonkravId, false));
        dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonkrav.dokumentasjonkravId, false));

        if (validFiles.length) {
            const newDokumentasjonkrav = {...dokumentasjonkravFiler};
            if (newDokumentasjonkrav[dokumentasjonkravReferanse]) {
                newDokumentasjonkrav[dokumentasjonkravReferanse] =
                    newDokumentasjonkrav[dokumentasjonkravReferanse].concat(validFiles);
            } else {
                newDokumentasjonkrav[dokumentasjonkravReferanse] = validFiles;
            }

            const totalFileSize = newDokumentasjonkrav[dokumentasjonkravReferanse].reduce(
                (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
                0
            );

            if (illegalCombinedFilesSize(totalFileSize)) {
                setOverMaksStorrelse(true);
                setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
                fileUploadFailedEvent("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            }
            setDokumentasjonkravFiler(newDokumentasjonkrav);
        }

        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    const onDeleteClick = (event: any, dokumentasjonkravReferanse: string, fil: Fil) => {
        setErrorMessage(undefined);

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
            }
        }

        const totalFileSize = dokumentasjonkravFiler[dokumentasjonkravReferanse].reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
            0
        );

        if (illegalCombinedFilesSize(totalFileSize)) {
            setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            setOverMaksStorrelse(true);
        } else {
            setOverMaksStorrelse(false);
        }
    };

    const visDokumentasjonkravDetaljerFeiler: boolean =
        includesReferense(dokumentasjonkravReferanserSomFeilet) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        includesReferense(dokumentasjonkravReferanserSomFeiletPaBackend) ||
        includesReferense(dokumentasjonkravReferanserSomFeiletIVirussjekkPaBackend);

    return (
        <div>
            <div
                className={
                    (visDokumentasjonkravDetaljerFeiler ? "oppgaver_detaljer_feil_ramme" : "oppgaver_detaljer") +
                    " luft_over_1rem"
                }
            >
                {dokumentasjonkrav.frist && antallDagerSidenFristBlePassert <= 0 && (
                    <BodyShort spacing>
                        <FormattedMessage
                            id="oppgaver.innsendelsesfrist"
                            values={{innsendelsesfrist: formatDato(dokumentasjonkrav.frist!)}}
                        />
                    </BodyShort>
                )}
                {dokumentasjonkrav.frist && antallDagerSidenFristBlePassert > 0 && (
                    <BodyShort spacing>
                        <FormattedMessage
                            id="oppgaver.innsendelsesfrist_passert"
                            values={{innsendelsesfrist: formatDato(dokumentasjonkrav.frist!)}}
                        />
                    </BodyShort>
                )}
                {dokumentasjonkrav.dokumentasjonkravElementer.map(
                    (dokumentasjonkravElement, dokumentasjonkravElementIndex) => {
                        return (
                            <DokumentasjonkravElementView
                                key={dokumentasjonkravElementIndex}
                                dokumentasjonkravElement={dokumentasjonkravElement}
                                dokumentasjonKravIndex={dokumentasjonkravIndex}
                                dokumentasjonkravReferanse={dokumentasjonkravElement.dokumentasjonkravReferanse ?? ""}
                                onChange={onChange}
                                onDelete={onDeleteClick}
                                filer={
                                    dokumentasjonkravFiler[dokumentasjonkravElement.dokumentasjonkravReferanse ?? ""] ??
                                    []
                                }
                            />
                        );
                    }
                )}
                {kanLasteOppVedlegg && (
                    <ButtonWrapper>
                        <Button
                            variant="primary"
                            disabled={isUploading}
                            onClick={(event) => {
                                onSendClicked(event);
                            }}
                        >
                            <FormattedMessage id="oppgaver.send_knapp_tittel" />
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
        </div>
    );
};

export default DokumentasjonKravView;
