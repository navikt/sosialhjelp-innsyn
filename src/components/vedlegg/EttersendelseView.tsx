import React, {useEffect, useState} from "react";
import {Fil, InnsynsdataActionTypeKeys, InnsynsdataSti} from "../../redux/innsynsdata/innsynsdataReducer";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {REST_STATUS} from "../../utils/restUtils";
import {FileError, findFilesWithError, hasFilesWithErrorStatus, isFileErrorsNotEmpty} from "../../utils/vedleggUtils";
import {isFileUploadAllowed} from "../driftsmelding/DriftsmeldingUtilities";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";
import {logInfoMessage} from "../../redux/innsynsdata/loggActions";
import {onSendVedleggClicked} from "../oppgaver/onSendVedleggClicked";
import AddFileButton, {TextAndButtonWrapper} from "./AddFileButton";
import {v4 as uuidv4} from "uuid";
import FileItemView from "./FileItemView";
import {setFileUploadFailedVirusCheckInBackend} from "../../redux/innsynsdata/innsynsDataActions";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Accordion, BodyShort, Button, Label, Loader} from "@navikt/ds-react";
import {ErrorMessage} from "../errors/ErrorMessage";
import styled from "styled-components/macro";
import useKommune from "../../hooks/useKommune";
import {useQueryClient} from "@tanstack/react-query";
import ReturnErrorMessage from "../oppgaver/ReturnErrorMessage";
import ErrorMessagePlaceholder from "../errors/ErrorMessage";
/*
 * Siden det er ikke noe form for oppgaveId så blir BACKEND_FEIL_ID
 * brukt sånnn at man slipper å lage egne actions
 * og reducere for denne ene komponenten.
 */
const BACKEND_FEIL_ID = "backendFeilId";

interface Props {
    restStatus: REST_STATUS;
}

const ButtonWrapper = styled.div`
    margin-top: 1rem;
`;

const EttersendelseView: React.FC<Props> = ({restStatus}) => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const uuid = uuidv4();
    const {t} = useTranslation();

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [listeMedFilerSomFeiler, setListeMedFilerSomFeiler] = useState<Array<FileError>>([]);

    const filer: Fil[] = useSelector((state: InnsynAppState) => state.innsynsdata.ettersendelse.filer);

    const vedleggKlarForOpplasting = filer.length > 0;
    const [sendVedleggTrykket, setSendVedleggTrykket] = useState<boolean>(false);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const otherVedleggLastesOpp =
        otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;

    const [overMaksStorrelse, setOverMaksStorrelse] = useState(false);

    const listeOverVedleggIderSomFeiletPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletPaBackend
    );
    const listeOverOppgaveIderSomFeiletIVirussjekkPaBackend: string[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.listeOverOppgaveIderSomFeiletIVirussjekkPaBackend
    );

    useEffect(() => {
        if (filer.length > 0) {
            window.addEventListener("beforeunload", alertUser);
        }
        return function unload() {
            window.removeEventListener("beforeunload", alertUser);
        };
    }, [filer]);

    const alertUser = (event: any) => {
        event.preventDefault();
        event.returnValue = "";
    };

    const opplastingFeilet = hasFilesWithErrorStatus(filer);

    const onChange = (event: any) => {
        setSendVedleggTrykket(false);

        setListeMedFilerSomFeiler([]);
        const files: FileList | null = event.currentTarget.files;

        if (files) {
            const filerMedFeil: Array<FileError> = findFilesWithError(files, 0);
            if (filerMedFeil.length === 0) {
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
                    if (!file) {
                        logInfoMessage("Tom fil ble forsøkt lagt til i EttersendelseView.onChange()");
                    } else {
                        dispatch({
                            type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_ETTERSENDELSE,
                            fil: {
                                filnavn: file.name,
                                status: "INITIALISERT",
                                file: file,
                            },
                        });
                    }
                }
            } else {
                setListeMedFilerSomFeiler(filerMedFeil);
            }
        }
        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    const {kommune} = useKommune();
    const kanLasteOppVedlegg: boolean = isFileUploadAllowed(kommune);

    const visDetaljeFeiler: boolean =
        opplastingFeilet !== undefined ||
        listeMedFilerSomFeiler.length > 0 ||
        (!vedleggKlarForOpplasting && sendVedleggTrykket) ||
        overMaksStorrelse ||
        listeOverVedleggIderSomFeiletPaBackend.includes(BACKEND_FEIL_ID) ||
        listeOverOppgaveIderSomFeiletIVirussjekkPaBackend.includes(BACKEND_FEIL_ID);

    const onDeleteClick = (event: MouseEvent, fil: Fil, vedleggIndex?: number) => {
        setOverMaksStorrelse(false);
        dispatch(setFileUploadFailedVirusCheckInBackend(BACKEND_FEIL_ID, false));
        dispatch({
            type: InnsynsdataActionTypeKeys.FJERN_FIL_FOR_ETTERSENDELSE,
            vedleggIndex: vedleggIndex,
            internalIndex: 0,
            externalIndex: 0,
            fil: fil,
        });
        event.preventDefault();
    };

    return (
        <>
            <DriftsmeldingVedlegg
                leserData={restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING}
            />
            <div className={"oppgaver_detaljer " + (visDetaljeFeiler ? " oppgaver_detalj_feil_ramme" : "")}>
                <div
                    className={
                        "oppgaver_detalj " +
                        (opplastingFeilet ||
                        listeMedFilerSomFeiler.length > 0 ||
                        (!vedleggKlarForOpplasting && sendVedleggTrykket)
                            ? " oppgaver_detalj_feil"
                            : "")
                    }
                    style={{marginTop: "0px"}}
                >
                    <TextAndButtonWrapper>
                        <div>
                            <Label as="p">{t("andre_vedlegg.type")}</Label>
                            <BodyShort>{t("andre_vedlegg.tilleggsinfo")}</BodyShort>
                        </div>
                        {kanLasteOppVedlegg && (
                            <AddFileButton onChange={onChange} referanse={BACKEND_FEIL_ID} id={uuid} />
                        )}
                    </TextAndButtonWrapper>

                    <FileItemView filer={filer} onDelete={onDeleteClick} />

                    <ErrorMessagePlaceholder>
                        {isFileErrorsNotEmpty(listeMedFilerSomFeiler) && (
                            <ReturnErrorMessage listeMedFil={listeMedFilerSomFeiler} oppgaveElementIndex={0} />
                        )}
                    </ErrorMessagePlaceholder>
                </div>
                <ButtonWrapper>
                    <Button
                        variant="primary"
                        disabled={!kanLasteOppVedlegg || vedleggLastesOpp || otherVedleggLastesOpp}
                        onClick={(event: any) => {
                            logButtonOrLinkClick("Ettersendelse: Send vedlegg");
                            if (!vedleggKlarForOpplasting) {
                                setSendVedleggTrykket(true);
                                return;
                            }
                            onSendVedleggClicked(
                                event,
                                dispatch,
                                BACKEND_FEIL_ID,
                                InnsynsdataSti.VEDLEGG,
                                fiksDigisosId,
                                setOverMaksStorrelse,
                                queryClient,
                                undefined,
                                filer
                            );
                        }}
                        iconPosition="right"
                        icon={vedleggLastesOpp && <Loader />}
                    >
                        {t("andre_vedlegg.send_knapp_tittel")}
                    </Button>
                </ButtonWrapper>
            </div>

            {listeOverVedleggIderSomFeiletPaBackend.includes(BACKEND_FEIL_ID) && (
                <ErrorMessage className="oppgaver_vedlegg_feilmelding">
                    {t("vedlegg.opplasting_backend_feilmelding")}
                </ErrorMessage>
            )}

            {listeOverOppgaveIderSomFeiletIVirussjekkPaBackend.includes(BACKEND_FEIL_ID) && (
                <ErrorMessage className="oppgaver_vedlegg_feilmelding">
                    {t("vedlegg.opplasting_backend_virus_feilmelding")}
                </ErrorMessage>
            )}

            {overMaksStorrelse && (
                <ErrorMessage className="oppgaver_vedlegg_feilmelding">
                    {t("vedlegg.ulovlig_storrelse_av_alle_valgte_filer")}
                </ErrorMessage>
            )}

            {(opplastingFeilet || (!vedleggKlarForOpplasting && sendVedleggTrykket)) && (
                <ErrorMessage className="oppgaver_vedlegg_feilmelding">
                    {t(opplastingFeilet ? "vedlegg.opplasting_feilmelding" : "vedlegg.minst_ett_vedlegg")}
                </ErrorMessage>
            )}
        </>
    );
};

export default EttersendelseView;
