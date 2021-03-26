import {alertUser, createFormDataWithVedlegg, hasNotAddedFiles, maxCombinedFileSize} from "../../utils/vedleggUtils";
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
    VedleggActionType,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {fetchPost, fetchPostGetErrors, REST_STATUS} from "../../utils/restUtils";

const sendDispatchDokumentasjonEtterspurt = (
    dispatch: React.Dispatch<any>,
    fil: Fil,
    vedlegg: VedleggActionType,
    index: number
) => {
    dispatch({
        type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL,
        fil: {filnavn: fil.filnavn} as Fil,
        status: fil.status,
        innsendelsesfrist: vedlegg.innsendelsesfrist,
        dokumenttype: vedlegg.type,
        tilleggsinfo: vedlegg.tilleggsinfo,
        vedleggIndex: index,
    });
};

const sendDispatchEttersendelse = (dispatch: React.Dispatch<any>, fil: Fil, index: number) => {
    dispatch({
        type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_ETTERSENDELSESFIL,
        fil: {filnavn: fil.filnavn} as Fil,
        status: fil.status,
        vedleggIndex: index,
    });
};

const itererOverfiler = (
    dispatch: React.Dispatch<any>,
    vedlegg: any,
    innsyndataSti: InnsynsdataSti,
    containsError: boolean
) => {
    vedlegg.filer.forEach((fil: Fil, index: number) => {
        if (fil.status !== "OK") {
            containsError = true;
        }
        if (innsyndataSti === InnsynsdataSti.OPPGAVER) {
            sendDispatchDokumentasjonEtterspurt(dispatch, fil, vedlegg, index);
        } else {
            sendDispatchEttersendelse(dispatch, fil, index);
        }
    });

    return containsError;
};

const SendVedlegg = (
    event: any,
    fiksDigisosId: string | undefined,
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void,
    dispatch: React.Dispatch<any>,
    datasti: InnsynsdataSti,
    dokId: string,
    formData: any,
    filer?: Fil[]
) => {
    window.removeEventListener("beforeunload", alertUser);

    dispatch(setFileUploadFailedInBackend(dokId, false));
    dispatch(setFileUploadFailedVirusCheckInBackend(dokId, false));

    if (!filer || !fiksDigisosId) {
        event.preventDefault();
        return;
    }

    try {
        var formData = createFormDataWithVedlegg(dokumentasjon);
    } catch (e) {
        dispatch(setFileUploadFailed(dokId, true));
        logInfoMessage("Validering vedlegg feilet: " + e.message);
        event.preventDefault();
        return;
    }
    const sti: InnsynsdataSti = InnsynsdataSti.VEDLEGG;
    const path = innsynsdataUrl(fiksDigisosId, sti);

    dispatch(settRestStatus(datasti, REST_STATUS.PENDING));

    const ingenFilerValgt = hasNotAddedFiles(dokumentasjon);
    dispatch(setFileUploadFailed(dokId, ingenFilerValgt));

    setOverMaksStorrelse(false);

    const sammensattFilStorrelseForOppgaveElement = dokumentasjonEtterspurt.oppgaveElementer
        .flatMap((oppgaveElement: DokumentasjonEtterspurtElement) => {
            return oppgaveElement.filer ?? [];
        })
        .reduce((accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file?.size : 0), 0);

    setOverMaksStorrelse(sammensattFilStorrelseForOppgaveElement > maxCombinedFileSize);

    if (ingenFilerValgt) {
        dispatch(settRestStatus(datasti, REST_STATUS.FEILET));
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
            .then(() => {
                let containsError: boolean = false;

                containsError = itererOverfiler(dispatch, filer, datasti, containsError);

                if (containsError) {
                    dispatch(settRestStatus(datasti, REST_STATUS.FEILET));
                } else {
                    if (datasti === InnsynsdataSti.OPPGAVER) {
                        dispatch(hentOppgaveMedId(fiksDigisosId, datasti, dokId));
                    }
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
                }
            })
            .catch((e) => {
                // Kjør feilet kall på nytt for å få tilgang til feilmelding i JSON data:
                fetchPostGetErrors(path, formData, "multipart/form-data").then((errorResponse: any) => {
                    if (errorResponse.message === "Mulig virus funnet") {
                        dispatch(setFileUploadFailedInBackend(dokId, false));
                        dispatch(setFileUploadFailedVirusCheckInBackend(dokId, true));
                    }
                });
                dispatch(settRestStatus(datasti, REST_STATUS.FEILET));
                dispatch(setFileUploadFailedInBackend(dokId, true));
                logWarningMessage("Feil med opplasting av vedlegg: " + e.message);
            });
    } else {
        dispatch(settRestStatus(datasti, REST_STATUS.FEILET));
    }
    event.preventDefault();
};

export default SendVedlegg;
