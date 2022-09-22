import React, {useState} from "react";
import {
    DokumentasjonEtterspurt,
    Fil,
    InnsynsdataSti,
    KommuneResponse,
    settRestStatus,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {useDispatch, useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";
import {InnsynAppState} from "../../redux/reduxTypes";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import {antallDagerEtterFrist} from "./Oppgaver";
import {formatDato} from "../../utils/formatting";
import {
    createFormDataWithVedleggFromOppgaver,
    getVisningstekster,
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
import {fileUploadFailedEvent, logButtonOrLinkClick} from "../../utils/amplitude";
import {BodyShort, Button, Loader} from "@navikt/ds-react";
import {ErrorMessage} from "../errors/ErrorMessage";
import styled from "styled-components";
import {onSendVedleggClicked} from "./onSendVedleggClickedNew";

interface Props {
    dokumentasjonEtterspurt: DokumentasjonEtterspurt;
    oppgaverErFraInnsyn: boolean;
    oppgaveIndex: any;
}

export interface DokumentasjonEtterspurtFiler {
    [key: string]: Fil[];
}

const ButtonWrapper = styled.div`
    margin-top: 1rem;
`;

const DokumentasjonEtterspurtView: React.FC<Props> = ({dokumentasjonEtterspurt, oppgaverErFraInnsyn, oppgaveIndex}) => {
    const dispatch = useDispatch();
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [dokumentasjonEtterspurtFiler, setDokumentasjonEtterspurtFiler] = useState<DokumentasjonEtterspurtFiler>({});

    const listeOverDokumentasjonEtterspurtIderSomFeilet: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOpggaveIderSomFeilet
    );
    const listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletPaBackend
    );
    const listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletIVirussjekkPaBackend
    );

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommuneResponse);

    const opplastingFeilet = oppgaveHasFilesWithError(dokumentasjonEtterspurt.oppgaveElementer);

    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(dokumentasjonEtterspurt.innsendelsesfrist!!));

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const includesReferanse = (feilReferanse: string[]) => {
        dokumentasjonEtterspurt.oppgaveElementer.filter((doketterspurt) => {
            if (doketterspurt.hendelsereferanse) {
                return feilReferanse.includes(doketterspurt.hendelsereferanse);
            }
            return false;
        });
        return false;
    };

    const visDokumentasjonEtterspurtDetaljeFeiler: boolean =
        includesReferanse(listeOverDokumentasjonEtterspurtIderSomFeilet) ||
        opplastingFeilet !== undefined ||
        overMaksStorrelse ||
        includesReferanse(listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend) ||
        includesReferanse(listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend);

    const onSendClicked = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (!fiksDigisosId || overMaksStorrelse) {
            return;
        }
        setIsUploading(true);
        setErrorMessage(undefined);
        const path = innsynsdataUrl(fiksDigisosId, InnsynsdataSti.VEDLEGG);

        dispatch(
            setFileUploadFailed(
                dokumentasjonEtterspurt.oppgaveId,
                Object.keys(dokumentasjonEtterspurtFiler).length === 0
            )
        );
        console.log("etterspurt", dokumentasjonEtterspurtFiler);

        if (Object.keys(dokumentasjonEtterspurtFiler).length === 0) {
            setErrorMessage("vedlegg.minst_ett_vedlegg");
            logInfoMessage("Validering vedlegg feilet: Ingen filer valgt");
            setIsUploading(false);
            console.log("har ikke vedlegg");
        }

        const handleFileWithVirus = () => {
            setErrorMessage("vedlegg.opplasting_backend_virus_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_backend_virus_feilmelding");
            setIsUploading(false);
            dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, false));
            dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonEtterspurt.oppgaveId, true));
            console.log("etterspurt handleFileWithVirus filer", dokumentasjonEtterspurtFiler);
        };
        const handleFileUploadFailed = () => {
            dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SAKSSTATUS, false));
            setErrorMessage("vedlegg.opplasting_feilmelding");
            fileUploadFailedEvent("vedlegg.opplasting_feilmelding");
            setIsUploading(false);
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, true));
            console.log("etterspurt handleFileUploadFailed filer", dokumentasjonEtterspurtFiler);
        };
        const onSuccessful = (reference: string) => {
            dispatch(hentOppgaveMedId(fiksDigisosId, InnsynsdataSti.OPPGAVER, dokumentasjonEtterspurt.oppgaveId));

            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.VEDLEGG, false));
            dispatch(hentInnsynsdata(fiksDigisosId ?? "", InnsynsdataSti.HENDELSER, false));
            console.log("etterspurt onSuccessful filer", dokumentasjonEtterspurtFiler);

            setIsUploading(false);
        };
        dokumentasjonEtterspurt.oppgaveElementer.forEach((dokumentasjonEtterspurtElement) => {
            const reference = dokumentasjonEtterspurtElement.hendelsereferanse ?? "";
            const filer = dokumentasjonEtterspurtFiler[reference];
            if (!filer || filer.length === 0) {
                return;
            }

            const formData = createFormDataWithVedleggFromOppgaver(
                dokumentasjonEtterspurtElement,
                filer,
                dokumentasjonEtterspurt.innsendelsesfrist
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

    const onAddFileChange = (event: any, hendelseReferanse: string, validFiles: Fil[]) => {
        setErrorMessage(undefined);
        dispatch(setFileUploadFailed(dokumentasjonEtterspurt.oppgaveId, false));
        dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, false));
        dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonEtterspurt.oppgaveId, false));

        if (validFiles.length) {
            const newDokumentasjonEtterspurt = {...dokumentasjonEtterspurtFiler};
            if (newDokumentasjonEtterspurt[hendelseReferanse]) {
                newDokumentasjonEtterspurt[hendelseReferanse] =
                    newDokumentasjonEtterspurt[hendelseReferanse].concat(validFiles);
            } else {
                newDokumentasjonEtterspurt[hendelseReferanse] = validFiles;
            }

            const totalFileSize = newDokumentasjonEtterspurt[hendelseReferanse].reduce(
                (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
                0
            );

            if (illegalCombinedFilesSize(totalFileSize)) {
                setOverMaksStorrelse(true);
                setErrorMessage("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
                fileUploadFailedEvent("vedlegg.ulovlig_storrelse_av_alle_valgte_filer");
            }
            setDokumentasjonEtterspurtFiler(newDokumentasjonEtterspurt);
        }

        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    const onDeleteClick = (event: any, hendelseReferanse: string, fil: Fil) => {
        setErrorMessage(undefined);

        if (hendelseReferanse !== "" && fil) {
            const newDokumentasjonEtterspurt = {...dokumentasjonEtterspurtFiler};
            if (newDokumentasjonEtterspurt[hendelseReferanse]) {
                const remainingFiles = newDokumentasjonEtterspurt[hendelseReferanse].filter(
                    (doketterspurt) => doketterspurt.file !== fil.file
                );

                if (remainingFiles.length) {
                    newDokumentasjonEtterspurt[hendelseReferanse] = remainingFiles;
                } else {
                    delete newDokumentasjonEtterspurt[hendelseReferanse];
                }
            }
            setDokumentasjonEtterspurtFiler(newDokumentasjonEtterspurt);
        }

        const totalFileSize = dokumentasjonEtterspurtFiler[hendelseReferanse].reduce(
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

    return (
        <div>
            <div
                className={
                    (visDokumentasjonEtterspurtDetaljeFeiler ? "oppgaver_detaljer_feil_ramme" : "oppgaver_detaljer") +
                    " luft_over_1rem"
                }
            >
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
                            filer={dokumentasjonEtterspurtFiler[oppgaveElement.hendelsereferanse ?? ""] ?? []}
                        />
                    );
                })}
                {kanLasteOppVedlegg && (
                    <ButtonWrapper>
                        <Button
                            variant="primary"
                            disabled={isUploading}
                            onClick={(event) => {
                                logButtonOrLinkClick("Dokumentasjon etterspurt: Send vedlegg");
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

export default DokumentasjonEtterspurtView;
