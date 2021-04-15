import {
    alertUser,
    hasNotAddedFiles,
    maxCombinedFileSize,
    opprettFormDataMedVedleggFraOppgaver,
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
    dokumentasjonEtterspurt: DokumentasjonEtterspurt,
    fiksDigisosId: string | undefined,
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void
) => {
    window.removeEventListener("beforeunload", alertUser);
    dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, false));
    dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonEtterspurt.oppgaveId, false));

    if (!dokumentasjonEtterspurt || !fiksDigisosId) {
        event.preventDefault();
        return;
    }

    try {
        var formData = opprettFormDataMedVedleggFraOppgaver(dokumentasjonEtterspurt);
    } catch (e) {
        dispatch(setFileUploadFailed(dokumentasjonEtterspurt.oppgaveId, true));
        logInfoMessage("Validering vedlegg feilet: " + e.message);
        event.preventDefault();
        return;
    }
    const sti: InnsynsdataSti = InnsynsdataSti.VEDLEGG;
    const path = innsynsdataUrl(fiksDigisosId, sti);

    dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.PENDING));

    const ingenFilerValgt = hasNotAddedFiles(dokumentasjonEtterspurt);
    dispatch(setFileUploadFailed(dokumentasjonEtterspurt.oppgaveId, ingenFilerValgt));

    setOverMaksStorrelse(false);

    const sammensattFilStorrelseForOppgaveElement = dokumentasjonEtterspurt.oppgaveElementer
        .flatMap((oppgaveElement: DokumentasjonEtterspurtElement) => {
            return oppgaveElement.filer ?? [];
        })
        .reduce((accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file?.size : 0), 0);

    setOverMaksStorrelse(sammensattFilStorrelseForOppgaveElement > maxCombinedFileSize);

    if (ingenFilerValgt) {
        dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
        logInfoMessage("Validering vedlegg feilet: Ingen filer valgt");
        event.preventDefault();
        return;
    }

    if (sammensattFilStorrelseForOppgaveElement > maxCombinedFileSize) {
        logInfoMessage("Validering vedlegg feilet: Totalt over 150MB for alle oppgaver");
    }

    if (
        sammensattFilStorrelseForOppgaveElement < maxCombinedFileSize &&
        sammensattFilStorrelseForOppgaveElement !== 0
    ) {
        fetchPost(path, formData, "multipart/form-data")
            .then((filRespons: any) => {
                let harFeil: boolean = false;
                if (Array.isArray(filRespons)) {
                    filRespons.forEach((respons) => {
                        respons.filer.forEach((fil: Fil, index: number) => {
                            if (fil.status !== "OK") {
                                harFeil = true;
                            }
                            dispatch({
                                type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL,
                                fil: {filnavn: fil.filnavn} as Fil,
                                status: fil.status,
                                innsendelsesfrist: respons.innsendelsesfrist,
                                dokumenttype: respons.type,
                                tilleggsinfo: respons.tilleggsinfo,
                                vedleggIndex: index,
                            });
                        });
                    });
                }
                if (harFeil) {
                    dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
                } else {
                    dispatch(
                        hentOppgaveMedId(fiksDigisosId, InnsynsdataSti.OPPGAVER, dokumentasjonEtterspurt.oppgaveId)
                    );
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
                }
            })
            .catch((e) => {
                // Kjør feilet kall på nytt for å få tilgang til feilmelding i JSON data:
                fetchPostGetErrors(path, formData, "multipart/form-data").then((errorResponse: any) => {
                    if (errorResponse.message === "Mulig virus funnet") {
                        dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, false));
                        dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonEtterspurt.oppgaveId, true));
                    }
                });
                dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
                dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, true));
                logWarningMessage("Feil med opplasting av vedlegg: " + e.message);
            });
    } else {
        dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
    }
    event.preventDefault();
};
