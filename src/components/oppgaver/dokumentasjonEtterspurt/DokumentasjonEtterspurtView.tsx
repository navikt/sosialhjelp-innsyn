import React, {useState} from "react";
import {
    DokumentasjonEtterspurt,
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    settRestStatus,
} from "../../../redux/innsynsdata/innsynsdataReducer";
import {useDispatch, useSelector} from "react-redux";
import {FormattedMessage} from "react-intl";
import {InnsynAppState} from "../../../redux/reduxTypes";
import {isFileUploadAllowed} from "../../driftsmelding/DriftsmeldingUtilities";
import {
    createFormDataWithVedleggFromOppgaver,
    hasNotAddedFiles,
    oppgaveHasFilesWithError,
} from "../../../utils/vedleggUtils";
import {fetchPost, fetchPostGetErrors, REST_STATUS} from "../../../utils/restUtils";
import {
    hentInnsynsdata,
    hentOppgaveMedId,
    innsynsdataUrl,
    setFileUploadFailed,
    setFileUploadFailedInBackend,
    setFileUploadFailedVirusCheckInBackend,
} from "../../../redux/innsynsdata/innsynsDataActions";
import {logInfoMessage, logWarningMessage} from "../../../redux/innsynsdata/loggActions";
import {
    fileUploadFailedEvent,
    logButtonOrLinkClick,
    logDuplicationsOfUploadedAttachmentsForDokEtterspurt,
} from "../../../utils/amplitude";
import {Button, Loader} from "@navikt/ds-react";
import {ErrorMessage} from "../../errors/ErrorMessage";
import styled from "styled-components";
import useKommune from "../../../hooks/useKommune";
import {getHentHendelserQueryKey} from "../../../generated/hendelse-controller/hendelse-controller";
import {useQueryClient} from "@tanstack/react-query";
import InnsendelsesFrist from "../InnsendelsesFrist";
import DokumentasjonEtterspurtElementer from "./DokumentasjonEtterspurtElementer";

interface Props {
    dokumentasjonEtterspurt: DokumentasjonEtterspurt;
    oppgaverErFraInnsyn: boolean;
    oppgaveIndex: any;
}

const ButtonWrapper = styled.div`
    margin-top: 1rem;
`;

const DokumentasjonEtterspurtView: React.FC<Props> = ({dokumentasjonEtterspurt, oppgaverErFraInnsyn, oppgaveIndex}) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);

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

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const visDokumentasjonEtterspurtDetaljeFeiler: boolean =
        listeOverDokumentasjonEtterspurtIderSomFeilet.includes(dokumentasjonEtterspurt.oppgaveId) ||
        opplastingFeilet !== undefined ||
        listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend.includes(dokumentasjonEtterspurt.oppgaveId) ||
        listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend.includes(dokumentasjonEtterspurt.oppgaveId);

    const onSendClicked = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (!fiksDigisosId) {
            return;
        }
        setIsUploading(true);
        const path = innsynsdataUrl(fiksDigisosId, InnsynsdataSti.VEDLEGG);
        const formData = createFormDataWithVedleggFromOppgaver(dokumentasjonEtterspurt);

        const noFilesAdded = hasNotAddedFiles(dokumentasjonEtterspurt);
        dispatch(setFileUploadFailed(dokumentasjonEtterspurt.oppgaveId, noFilesAdded));

        if (noFilesAdded) {
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            logInfoMessage("Validering vedlegg feilet: Ingen filer valgt");
            setIsUploading(false);
            event.preventDefault();
            return;
        }

        const handleFileWithVirus = () => {
            fileUploadFailedEvent("vedlegg.opplasting_backend_virus_feilmelding");
            setIsUploading(false);
            dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, false));
            dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonEtterspurt.oppgaveId, true));
        };
        const handleFileUploadFailed = () => {
            fileUploadFailedEvent("vedlegg.opplasting_feilmelding");
            setIsUploading(false);
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, true));
        };
        const onSuccessful = () => {
            fetchPost(path, formData, "multipart/form-data")
                .then((fileResponse: any) => {
                    let hasError: boolean = false;
                    if (Array.isArray(fileResponse)) {
                        fileResponse.forEach((response) => {
                            response.filer.forEach((fil: Fil, index: number) => {
                                if (fil.status !== "OK") {
                                    hasError = true;
                                }
                                dispatch({
                                    type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL,
                                    fil: {filnavn: fil.filnavn} as Fil,
                                    status: fil.status,
                                    innsendelsesfrist: response.innsendelsesfrist,
                                    dokumenttype: response.type,
                                    tilleggsinfo: response.tilleggsinfo,
                                    vedleggIndex: index,
                                });
                            });
                        });
                    }
                    if (hasError) {
                        dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
                    } else {
                        queryClient.refetchQueries(getHentHendelserQueryKey(fiksDigisosId));
                        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
                        dispatch(
                            hentOppgaveMedId(fiksDigisosId, InnsynsdataSti.OPPGAVER, dokumentasjonEtterspurt.oppgaveId)
                        );
                    }
                    setIsUploading(false);
                })
                .catch((e) => {
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SAKSSTATUS, false));
                    // Kjør feilet kall på nytt for å få tilgang til feilmelding i JSON data:
                    fetchPostGetErrors(path, formData, "multipart/form-data").then((errorResponse: any) => {
                        if (errorResponse.message === "Mulig virus funnet") {
                            handleFileWithVirus();
                        }
                    });
                    handleFileUploadFailed();
                    logWarningMessage("Feil med opplasting av vedlegg: " + e.message);
                });
        };
        onSuccessful();
    };

    return (
        <li>
            <div
                className={
                    (visDokumentasjonEtterspurtDetaljeFeiler ? "oppgaver_detaljer_feil_ramme" : "oppgaver_detaljer") +
                    " luft_over_1rem"
                }
            >
                {oppgaverErFraInnsyn && <InnsendelsesFrist frist={dokumentasjonEtterspurt.innsendelsesfrist} />}

                <DokumentasjonEtterspurtElementer
                    dokumentasjonEtterspurt={dokumentasjonEtterspurt}
                    oppgaveIndex={oppgaveIndex}
                />
                {listeOverDokumentasjonEtterspurtIderSomFeiletPaBackend.includes(dokumentasjonEtterspurt.oppgaveId) && (
                    <ErrorMessage className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                        <FormattedMessage id={"vedlegg.opplasting_backend_feilmelding"} />
                    </ErrorMessage>
                )}
                {!isLoading && kanLasteOppVedlegg && (
                    <ButtonWrapper>
                        <Button
                            disabled={isUploading}
                            onClick={(event: any) => {
                                logButtonOrLinkClick("Dokumentasjon etterspurt: Send vedlegg");
                                onSendClicked(event);
                            }}
                            iconPosition="right"
                            icon={isUploading && <Loader />}
                        >
                            <FormattedMessage id="oppgaver.send_knapp_tittel" />
                        </Button>
                    </ButtonWrapper>
                )}
            </div>
            {listeOverDokumentasjonEtterspurtIderSomFeiletIVirussjekkPaBackend.includes(
                dokumentasjonEtterspurt.oppgaveId
            ) && (
                <ErrorMessage className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.opplasting_backend_virus_feilmelding"} />
                </ErrorMessage>
            )}

            {(listeOverDokumentasjonEtterspurtIderSomFeilet.includes(dokumentasjonEtterspurt.oppgaveId) ||
                opplastingFeilet) && (
                <ErrorMessage className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage
                        id={
                            listeOverDokumentasjonEtterspurtIderSomFeilet.includes(dokumentasjonEtterspurt.oppgaveId)
                                ? "vedlegg.minst_ett_vedlegg"
                                : "vedlegg.opplasting_feilmelding"
                        }
                    />
                </ErrorMessage>
            )}
        </li>
    );
};

export default DokumentasjonEtterspurtView;
