import {
    alertUser,
    hasNotAddedFiles,
    maxCombinedFileSize,
    createFormDataWithVedleggFromFiler,
    createFormDataWithVedleggFromOppgaver,
    createFormDataWithVedleggFromDokumentasjonkrav,
    hasNotAddedFilesToDokkrav,
} from "../../utils/vedleggUtils";
import {
    hentDokumentasjonkravMedId,
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
    DokumentasjonKrav,
    DokumentasjonKravElement,
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    settRestStatus,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {fetchPost, fetchPostGetErrors, REST_STATUS} from "../../utils/restUtils";

export const onSendVedleggClicked = (
    event: any,
    dispatch: React.Dispatch<any>,
    vedleggId: string,
    innsyndatasti: InnsynsdataSti,
    fiksDigisosId: string | undefined,
    setAboveMaxSize: (aboveMaxSize: boolean) => void,
    oppgave?: DokumentasjonEtterspurt,
    dokumentasjonData?: FormData,
    filer?: Fil[]
) => {
    window.removeEventListener("beforeunload", alertUser);
    dispatch(setFileUploadFailedInBackend(vedleggId, false));
    dispatch(setFileUploadFailedVirusCheckInBackend(vedleggId, false));

    if ((!oppgave && !dokumentasjonData && !filer) || !fiksDigisosId) {
        event.preventDefault();
        return;
    }

    const path = innsynsdataUrl(fiksDigisosId, InnsynsdataSti.VEDLEGG);
    let formData: any = undefined;

    if (innsyndatasti === InnsynsdataSti.OPPGAVER && oppgave) {
        try {
            formData = createFormDataWithVedleggFromOppgaver(oppgave);
        } catch (e) {
            dispatch(setFileUploadFailed(vedleggId, true));
            logInfoMessage("Validering vedlegg feilet: " + e.message);
            event.preventDefault();
            return;
        }

        dispatch(settRestStatus(innsyndatasti, REST_STATUS.PENDING));
        const noFilesAdded = hasNotAddedFiles(oppgave);
        dispatch(setFileUploadFailed(vedleggId, noFilesAdded));

        if (noFilesAdded) {
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            logInfoMessage("Validering vedlegg feilet: Ingen filer valgt");
            event.preventDefault();
            return;
        }
    }

    if (innsyndatasti === InnsynsdataSti.DOKUMENTASJONKRAV && dokumentasjonData && filer) {
        formData = dokumentasjonData;

        //const noFilesAdded = hasNotAddedFilesToDokkrav(dokumentasjonData);
        //
        //if (noFilesAdded) {
        //    console.log(formData);
        //    dispatch(settRestStatus(InnsynsdataSti.DOKUMENTASJONKRAV, REST_STATUS.FEILET));
        //    logInfoMessage("Validering vedlegg feilet: Ingen filer valgt");
        //    event.preventDefault();
        //    return;
        //}
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

    if (innsyndatasti === InnsynsdataSti.OPPGAVER && oppgave) {
        combinedSizeOfAllFiles = oppgave.oppgaveElementer
            .flatMap((oppgaveElement: DokumentasjonEtterspurtElement) => {
                return oppgaveElement.filer ?? [];
            })
            .reduce(
                (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file?.size : 0),
                0
            );
    }

    if ((innsyndatasti === InnsynsdataSti.VEDLEGG || innsyndatasti === InnsynsdataSti.DOKUMENTASJONKRAV) && filer) {
        console.log("reduce", filer);
        combinedSizeOfAllFiles = filer.reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
            0
        );
    }

    setAboveMaxSize(combinedSizeOfAllFiles > maxCombinedFileSize);

    if (combinedSizeOfAllFiles > maxCombinedFileSize) {
        logInfoMessage("Validering vedlegg feilet: Totalt over 150MB for alle oppgaver");
    }
    console.log("combinessize", combinedSizeOfAllFiles);
    if (combinedSizeOfAllFiles < maxCombinedFileSize && combinedSizeOfAllFiles !== 0) {
        console.log("skalposte");
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
                            }
                            if (innsyndatasti === InnsynsdataSti.DOKUMENTASJONKRAV) {
                                // må oppdatere hvilke frister/dokkrav som skal fjernes
                                dispatch({
                                    type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_DOKUMENTASJONKRAV_FIL,
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
                    } else if (innsyndatasti === InnsynsdataSti.DOKUMENTASJONKRAV) {
                        //vedleggId som "testId" funker ikke. Må få implementert eller endret på funksjonaliteten.
                        dispatch(
                            hentDokumentasjonkravMedId(fiksDigisosId, InnsynsdataSti.DOKUMENTASJONKRAV, vedleggId)
                        );
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
