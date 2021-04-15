import {
    alertUser,
    hasNotAddedFiles,
    maxCombinedFileSize,
    opprettFormDataMedVedleggFraFiler,
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
    dokumentasjonsId: string,
    innsyndatasti: InnsynsdataSti,
    fiksDigisosId: string | undefined,
    setOverMaksStorrelse: (overMaksStorrelse: boolean) => void,
    dokumentasjon?: DokumentasjonEtterspurt,
    filer?: Fil[]
) => {
    window.removeEventListener("beforeunload", alertUser);
    dispatch(setFileUploadFailedInBackend(dokumentasjonsId, false));
    dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonsId, false));

    if ((!dokumentasjon && !filer) || !fiksDigisosId) {
        event.preventDefault();
        return;
    }

    const sti: InnsynsdataSti = InnsynsdataSti.VEDLEGG;
    const path = innsynsdataUrl(fiksDigisosId, sti);

    let formData: any = undefined;

    if (innsyndatasti === InnsynsdataSti.OPPGAVER && dokumentasjon) {
        try {
            formData = opprettFormDataMedVedleggFraOppgaver(dokumentasjon);
        } catch (e) {
            dispatch(setFileUploadFailed(dokumentasjonsId, true));
            logInfoMessage("Validering vedlegg feilet: " + e.message);
            event.preventDefault();
            return;
        }

        dispatch(settRestStatus(innsyndatasti, REST_STATUS.PENDING));
        const ingenFilerValgt = hasNotAddedFiles(dokumentasjon);
        dispatch(setFileUploadFailed(dokumentasjonsId, ingenFilerValgt));

        if (ingenFilerValgt) {
            dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
            logInfoMessage("Validering vedlegg feilet: Ingen filer valgt");
            event.preventDefault();
            return;
        }
    }

    if (innsyndatasti === InnsynsdataSti.VEDLEGG && filer) {
        try {
            formData = opprettFormDataMedVedleggFraFiler(filer);
        } catch (e) {
            dispatch(setFileUploadFailed(dokumentasjonsId, true));
            logInfoMessage("Validering vedlegg feilet: " + e.message);
            event.preventDefault();
            return;
        }
    }

    setOverMaksStorrelse(false);

    let sammensattFilStorrelseForOppgaveElement = 0;

    if (innsyndatasti === InnsynsdataSti.OPPGAVER && dokumentasjon) {
        sammensattFilStorrelseForOppgaveElement = dokumentasjon.oppgaveElementer
            .flatMap((oppgaveElement: DokumentasjonEtterspurtElement) => {
                return oppgaveElement.filer ?? [];
            })
            .reduce(
                (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file?.size : 0),
                0
            );
    }
    if (innsyndatasti === InnsynsdataSti.VEDLEGG && filer) {
        sammensattFilStorrelseForOppgaveElement = filer.reduce(
            (accumulator, currentValue: Fil) => accumulator + (currentValue.file ? currentValue.file.size : 0),
            0
        );
    }

    setOverMaksStorrelse(sammensattFilStorrelseForOppgaveElement > maxCombinedFileSize);

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
                            if (innsyndatasti === InnsynsdataSti.OPPGAVER) {
                                dispatch({
                                    type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL,
                                    fil: {filnavn: fil.filnavn} as Fil,
                                    status: fil.status,
                                    innsendelsesfrist: respons.innsendelsesfrist,
                                    dokumenttype: respons.type,
                                    tilleggsinfo: respons.tilleggsinfo,
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
                if (harFeil) {
                    dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
                } else {
                    dispatch(hentOppgaveMedId(fiksDigisosId, InnsynsdataSti.OPPGAVER, dokumentasjonsId));
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
                }
            })
            .catch((e) => {
                // Kjør feilet kall på nytt for å få tilgang til feilmelding i JSON data:
                fetchPostGetErrors(path, formData, "multipart/form-data").then((errorResponse: any) => {
                    if (errorResponse.message === "Mulig virus funnet") {
                        dispatch(setFileUploadFailedInBackend(dokumentasjonsId, false));
                        dispatch(setFileUploadFailedVirusCheckInBackend(dokumentasjonsId, true));
                    }
                });
                dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
                dispatch(setFileUploadFailedInBackend(dokumentasjonsId, true));
                logWarningMessage("Feil med opplasting av vedlegg: " + e.message);
            });
    } else {
        dispatch(settRestStatus(InnsynsdataSti.OPPGAVER, REST_STATUS.FEILET));
    }
    event.preventDefault();
};
