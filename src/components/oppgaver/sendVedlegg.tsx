import {
    alertUser,
    hasNotAddedFiles,
    maxCombinedFileSize,
    createFormDataWithVedleggFromFiler,
    createFormDataWithVedleggFromOppgaver,
} from "../../utils/vedleggUtils";
import {
    hentInnsynsdata,
    hentOppgaveMedId,
    innsynsdataUrl,
    setFileUploadFailed,
    setFileUploadFailedInBackend,
    setFileUploadFailedVirusCheckInBackend,
} from "../../redux/innsynsdata/innsynsDataActions";
import {logInfoMessage, logWarningMessage} from "../../redux/innsynsdata/loggActions";
import {
    DokumentasjonEtterspurt,
    DokumentasjonEtterspurtElement,
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    settRestStatus,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {fetchPost, fetchPostGetErrors, REST_STATUS} from "../../utils/restUtils";

export const SendVedlegg = (
    event: any,
    dispatch: React.Dispatch<any>,
    vedleggId: string,
    innsyndatasti: InnsynsdataSti,
    fiksDigisosId: string | undefined,
    setAboveMaxSize: (aboveMaxSize: boolean) => void,
    dokumentasjonEtterspurt?: DokumentasjonEtterspurt,
    filer?: Fil[]
) => {
    window.removeEventListener("beforeunload", alertUser);
    dispatch(setFileUploadFailedInBackend(vedleggId, false));
    dispatch(setFileUploadFailedVirusCheckInBackend(vedleggId, false));

    if ((!dokumentasjonEtterspurt && !filer) || !fiksDigisosId) {
        event.preventDefault();
        return;
    }

    const path = innsynsdataUrl(fiksDigisosId, InnsynsdataSti.VEDLEGG);
    let formData: any = undefined;

    if (innsyndatasti === InnsynsdataSti.OPPGAVER && dokumentasjonEtterspurt) {
        try {
            formData = createFormDataWithVedleggFromOppgaver(dokumentasjonEtterspurt);
        } catch (e) {
            dispatch(setFileUploadFailed(vedleggId, true));
            logInfoMessage("Validering vedlegg feilet: " + e.message);
            event.preventDefault();
            return;
        }

        dispatch(settRestStatus(innsyndatasti, REST_STATUS.PENDING));
        const noFilesAdded = hasNotAddedFiles(dokumentasjonEtterspurt);
        dispatch(setFileUploadFailed(vedleggId, noFilesAdded));

        if (noFilesAdded) {
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            logInfoMessage("Validering vedlegg feilet: Ingen filer valgt");
            event.preventDefault();
            return;
        }
    }

    if (innsyndatasti === InnsynsdataSti.VEDLEGG && filer) {
        try {
            formData = createFormDataWithVedleggFromFiler(filer);
        } catch (e) {
            dispatch(setFileUploadFailed(vedleggId, true));
            logInfoMessage("Validering vedlegg feilet: " + e.message);
            event.preventDefault();
            return;
        }
        dispatch(settRestStatus(innsyndatasti, REST_STATUS.PENDING));
    }

    setAboveMaxSize(false);

    let combinedSizeOfAllFiles = 0;

    if (innsyndatasti === InnsynsdataSti.OPPGAVER && dokumentasjonEtterspurt) {
        combinedSizeOfAllFiles = dokumentasjonEtterspurt.oppgaveElementer
            .flatMap((oppgaveElement: DokumentasjonEtterspurtElement) => {
                return oppgaveElement.filer ?? [];
            })
            .reduce(
                (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file?.size : 0),
                0
            );
    }
    if (innsyndatasti === InnsynsdataSti.VEDLEGG && filer) {
        combinedSizeOfAllFiles = filer.reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
            0
        );
    }

    setAboveMaxSize(combinedSizeOfAllFiles > maxCombinedFileSize);

    if (combinedSizeOfAllFiles > maxCombinedFileSize) {
        logInfoMessage("Validering vedlegg feilet: Totalt over 150MB for alle oppgaver");
    }

    if (combinedSizeOfAllFiles < maxCombinedFileSize && combinedSizeOfAllFiles !== 0) {
        fetchPost(path, formData, "multipart/form-data")
            .then((fileResponse: any) => {
                let hasError: boolean = false;
                if (Array.isArray(fileResponse)) {
                    fileResponse.forEach((response) => {
                        response.filer.forEach((fil: Fil, index: number) => {
                            if (fil.status !== "OK") {
                                hasError = true;
                            }
                            if (innsyndatasti === InnsynsdataSti.OPPGAVER) {
                                dispatch({
                                    type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL,
                                    fil: {filnavn: fil.filnavn} as Fil,
                                    status: fil.status,
                                    innsendelsesfrist: response.innsendelsesfrist,
                                    dokumenttype: response.type,
                                    tilleggsinfo: response.tilleggsinfo,
                                    vedleggIndex: index,
                                });
                            } else if (innsyndatasti === InnsynsdataSti.VEDLEGG) {
                                dispatch({
                                    type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_ETTERSENDELSESFIL,
                                    fil: {filnavn: fil.filnavn} as Fil,
                                    status: fil.status,
                                    vedleggIndex: index,
                                });
                            }
                        });
                    });
                }
                if (hasError) {
                    dispatch(settRestStatus(innsyndatasti, REST_STATUS.FEILET));
                } else {
                    if (innsyndatasti === InnsynsdataSti.OPPGAVER) {
                        dispatch(hentOppgaveMedId(fiksDigisosId, InnsynsdataSti.OPPGAVER, vedleggId));
                    }
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
                }
            })
            .catch((e) => {
                // Kjør feilet kall på nytt for å få tilgang til feilmelding i JSON data:
                fetchPostGetErrors(path, formData, "multipart/form-data").then((errorResponse: any) => {
                    if (errorResponse.message === "Mulig virus funnet") {
                        dispatch(setFileUploadFailedInBackend(vedleggId, false));
                        dispatch(setFileUploadFailedVirusCheckInBackend(vedleggId, true));
                    }
                });
                dispatch(settRestStatus(innsyndatasti, REST_STATUS.FEILET));
                dispatch(setFileUploadFailedInBackend(vedleggId, true));
                logWarningMessage("Feil med opplasting av vedlegg: " + e.message);
            });
    } else {
        dispatch(settRestStatus(innsyndatasti, REST_STATUS.FEILET));
    }
    event.preventDefault();
};
