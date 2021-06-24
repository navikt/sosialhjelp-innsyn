import React, {useState} from "react";
import {DokumentasjonKrav, Fil, InnsynsdataSti, KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {
    containsIllegalCharacters,
    createFormDataWithVedleggFromDokumentasjonkrav,
    dokumentasjonkravHasFilesWithError,
    illegalCombinedFilesSize,
    legalFileExtension,
    illegalFileSize,
} from "../../utils/vedleggUtils";
import DokumentasjonkravElementView from "./DokumentasjonkravElementView";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {antallDagerEtterFrist} from "./Oppgaver";
import {REST_STATUS} from "../../utils/restUtils";
import {Hovedknapp} from "nav-frontend-knapper";
import {onSendVedleggClicked} from "./onSendVedleggClickedNew";
import {FormattedMessage} from "react-intl";
import {SkjemaelementFeilmelding} from "nav-frontend-skjema";
import {innsynsdataUrl} from "../../redux/innsynsdata/innsynsDataActions";
import {validateFile} from "./validateFile";

interface Props {
    dokumentasjonkrav: DokumentasjonKrav;
    dokumentasjonkravIndex: number;
}

export interface DokumentasjonKravFiler {
    [key: string]: Fil[];
}

const DokumentasjonKravView: React.FC<Props> = ({dokumentasjonkrav, dokumentasjonkravIndex}) => {
    const [dokumentasjonkravFiler, setDokumentasjonkravFiler] = useState<DokumentasjonKravFiler>({});
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

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
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const otherVedleggLastesOpp =
        otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;

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
        if (!fiksDigisosId) {
            return;
        }
        setErrorMessage(undefined);
        const path = innsynsdataUrl(fiksDigisosId, InnsynsdataSti.VEDLEGG);

        if (Object.keys(dokumentasjonkravFiler).length === 0) {
            setErrorMessage("vedlegg.minst_ett_vedlegg");
        } //ingen filer valgt

        const handleFileResponse = (fil: {filnavn: string}, status: string) => {
            //ta kontakt med fag for å fine ut hvilken failcaser vi skal håndtere
            //trekke ut feilmelding key til enum
            //setErrorMessage("vedlegg.minst_ett_vedlegg");
        };
        const handleFileWithVirus = (reference: string) => {
            setErrorMessage("vedlegg.opplasting_backend_virus_feilmelding");
        };
        const handleFileUploadFailed = (reference: string) => {
            setErrorMessage("vedlegg.opplasting_feilmelding");
        };
        const onSuccessful = (reference: string) => {
            //gjør et get request med frist for å oppdatere redux state
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
                handleFileResponse,
                handleFileWithVirus,
                handleFileUploadFailed,
                onSuccessful
            );
        });
    };

    const visDokumentasjonkravDetaljerFeiler: boolean =
        includesReferense(dokumentasjonkravReferanserSomFeilet) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        includesReferense(dokumentasjonkravReferanserSomFeiletPaBackend) ||
        includesReferense(dokumentasjonkravReferanserSomFeiletIVirussjekkPaBackend);

    const onChange = (
        event: any,
        dokumentasjonkravReferanse: string,
        result: {filenames: Set<string>; validFiles: Fil[]; errors: Set<string>},
        files: FileList | null
    ) => {
        //setFileValidationErrors(undefined);
        setErrorMessage(undefined);

        if (files) {
            const filer = Array.from(files).map((file: File) => {
                return {filnavn: file.name, status: "INITIALISERT", file: file};
            });

            const totalFileSize = filer.reduce(
                (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
                0
            );

            if (illegalCombinedFilesSize(totalFileSize)) {
                setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            }

            const newDokumentasjonkrav = {...dokumentasjonkravFiler};
            if (newDokumentasjonkrav[dokumentasjonkravReferanse]) {
                newDokumentasjonkrav[dokumentasjonkravReferanse] = newDokumentasjonkrav[
                    dokumentasjonkravReferanse
                ].concat(result.validFiles);
            } else {
                newDokumentasjonkrav[dokumentasjonkravReferanse] = result.validFiles;
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
        //setFileValidationErrors(undefined);
        setErrorMessage(undefined);
        if (dokumentasjonkravReferanse !== "" && fil) {
            const newDokumentasjonkrav = {...dokumentasjonkravFiler};
            if (newDokumentasjonkrav[dokumentasjonkravReferanse]) {
                const remainingFiles = newDokumentasjonkrav[dokumentasjonkravReferanse].filter(
                    (dokkrav) => dokkrav.file !== fil.file
                );

                if (remainingFiles.length) {
                    newDokumentasjonkrav[dokumentasjonkravReferanse] = remainingFiles;
                } else {
                    delete newDokumentasjonkrav[dokumentasjonkravReferanse];
                }
            }
            setDokumentasjonkravFiler(newDokumentasjonkrav);
        }
    };

    return (
        <div>
            <div
                className={
                    (visDokumentasjonkravDetaljerFeiler ? "oppgaver_detaljer_feil_ramme" : "oppgaver_detaljer") +
                    " luft_over_1rem"
                }
            >
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
                    <Hovedknapp
                        disabled={vedleggLastesOpp || otherVedleggLastesOpp}
                        spinner={vedleggLastesOpp}
                        type="hoved"
                        className="luft_over_1rem"
                        onClick={(event) => {
                            //må håndter å fjerne krav når filer blir sendt inn.
                            onSendClicked(event);
                        }}
                    >
                        <FormattedMessage id="oppgaver.send_knapp_tittel" />
                    </Hovedknapp>
                )}
            </div>
            {errorMessage && (
                <SkjemaelementFeilmelding className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={errorMessage} />
                </SkjemaelementFeilmelding>
            )}
        </div>
    );
};

export default DokumentasjonKravView;
