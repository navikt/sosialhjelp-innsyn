import {useDispatch, useSelector} from "react-redux";
import {useQueryClient} from "@tanstack/react-query";
import {InnsynAppState} from "../../../redux/reduxTypes";
import React, {useState} from "react";
import {
    hentInnsynsdata,
    hentOppgaveMedId,
    innsynsdataUrl,
    setFileUploadFailed,
    setFileUploadFailedInBackend,
    setFileUploadFailedVirusCheckInBackend,
} from "../../../redux/innsynsdata/innsynsDataActions";
import {
    DokumentasjonEtterspurt,
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    settRestStatus,
} from "../../../redux/innsynsdata/innsynsdataReducer";
import {createFormDataWithVedleggFromOppgaver, hasNotAddedFiles} from "../../../utils/vedleggUtils";
import {fetchPost, fetchPostGetErrors, REST_STATUS} from "../../../utils/restUtils";
import {logInfoMessage, logWarningMessage} from "../../../redux/innsynsdata/loggActions";
import {fileUploadFailedEvent, logButtonOrLinkClick} from "../../../utils/amplitude";
import {getHentHendelserQueryKey} from "../../../generated/hendelse-controller/hendelse-controller";
import styled from "styled-components";
import {Button, Loader} from "@navikt/ds-react";
import {FormattedMessage} from "react-intl";

const ButtonWrapper = styled.div`
    margin-top: 1rem;
`;

interface Props {
    dokumentasjonEtterspurt: DokumentasjonEtterspurt;
}
const SendButton = (props: Props) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);
    const {dokumentasjonEtterspurt} = props;
    const [isUploading, setIsUploading] = useState(false);

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
    );
};
export default SendButton;
