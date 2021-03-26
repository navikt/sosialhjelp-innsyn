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
} from "../../redux/innsynsdata/innsynsdataReducer";
import {fetchPost, fetchPostGetErrors, REST_STATUS} from "../../utils/restUtils";

export function sendDispatchDokumentasjonEtterspurt(dispatch: React.Dispatch<any>, fil: Fil, respons: any, index: number) {
    dispatch({
        type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL,
        fil: {filnavn: fil.filnavn} as Fil,
        status: fil.status,
        innsendelsesfrist: respons.innsendelsesfrist,
        dokumenttype: respons.type,
        tilleggsinfo: respons.tilleggsinfo,
        vedleggIndex: index,
    });
}

function sendDispatch(dispatch: React.Dispatch<any>, fil: Fil, vedlegg: Fil | DokumentasjonEtterspurt, index: number, dokumentasjonetterspurt: string) {
    if (dokumentasjonetterspurt === "") {
    }
    sendDispatchDokumentasjonEtterspurt(dispatch, fil, vedlegg, index);
}

function itererOverfiler() {
    respons.filer.forEach((fil: Fil, index: number) => {
        if (fil.status !== "OK") {
            harFeil = true;
        }
        sendDispatchDokumentasjonEtterspurt(dispatch, fil, respons, index);
    });
}

const SendVedlegg = (
    event: any,
    dokumentasjonEtterspurt: DokumentasjonEtterspurt,
    fiksDigisosId: string | undefined,
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void,
    dispatch: React.Dispatch<any>,
    datasti: OPPGAVER
) => {
    window.removeEventListener("beforeunload", alertUser);
    dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, false));
    dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonEtterspurt.oppgaveId, false));

    if (!dokumentasjonEtterspurt || !fiksDigisosId) {
        event.preventDefault();
        return;
    }

    try {
        var formData = createFormDataWithVedlegg(dokumentasjonEtterspurt);
    } catch (e) {
        dispatch(setFileUploadFailed(dokumentasjonEtterspurt.oppgaveId, true));
        logInfoMessage("Validering vedlegg feilet: " + e.message);
        event.preventDefault();
        return;
    }
    const sti: InnsynsdataSti = InnsynsdataSti.VEDLEGG;
    const path = innsynsdataUrl(fiksDigisosId, sti);

    dispatch(settRestStatus(datasti, REST_STATUS.PENDING));

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
    ) {ª
        fetchPost(path, formData, "multipart/form-data")
            .then((filRespons: any) => {
                let harFeil: boolean = false;

                if (datasti === InnsynsdataSti.OPPGAVER && Array.isArray(filRespons)) {
                    filRespons.forEach((respons) => {
                        itererOverfiler(respons);
                    };
                } else if (Array.isArray(filRespons[0].filer)) {
                    itererOverfiler(filRespons[0].filer);
                }

                if (harFeil) {
                    dispatch(settRestStatus(datasti, REST_STATUS.FEILET));
                } else {
                    dispatch(
                        hentOppgaveMedId(fiksDigisosId, datasti, dokumentasjonEtterspurt.oppgaveId)
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
                dispatch(settRestStatus(datasti, REST_STATUS.FEILET));
                dispatch(setFileUploadFailedInBackend(dokumentasjonEtterspurt.oppgaveId, true));
                logWarningMessage("Feil med opplasting av vedlegg: " + e.message);
            });
    } else {
        dispatch(settRestStatus(datasti, REST_STATUS.FEILET));
    }
    event.preventDefault();
};

export default SendVedlegg;
