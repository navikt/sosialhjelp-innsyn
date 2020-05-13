import React, {ChangeEvent, useState} from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import {
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    settRestStatus,
    KommuneResponse,
} from "../../redux/innsynsdata/innsynsdataReducer";
import FilView from "../oppgaver/FilView";
import UploadFileIcon from "../ikoner/UploadFile";
import Lenke from "nav-frontend-lenker";
import {FormattedMessage} from "react-intl";
import {Hovedknapp} from "nav-frontend-knapper";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {hentInnsynsdata, innsynsdataUrl, logErrorMessage} from "../../redux/innsynsdata/innsynsDataActions";
import {fetchPost, REST_STATUS} from "../../utils/restUtils";
import {opprettFormDataMedVedleggFraFiler, FilFeil, validerFilArrayForFeil} from "../../utils/vedleggUtils";
import {skrivFeilmelding, sjekkerFilFeil} from "../oppgaver/OppgaveView";
import {erOpplastingAvVedleggEnabled} from "../driftsmelding/DriftsmeldingUtilities";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";

function harFilermedFeil(filer: Fil[]) {
    return filer.find((it) => {
        return it.status !== "OK" && it.status !== "PENDING" && it.status !== "INITIALISERT";
    });
}

const EttersendelseView: React.FC = () => {
    const dispatch = useDispatch();
    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);

    const [listeMedFilFeil, setListeMedFilFeil] = useState<Array<FilFeil>>([]);
    const filer: Fil[] = useSelector((state: InnsynAppState) => state.innsynsdata.ettersendelse.filer);
    //const feil: Vedleggfeil | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.ettersendelse.feil);
    const vedleggKlarForOpplasting = filer.length > 0;
    const [sendVedleggTrykket, setSendVedleggTrykket] = useState<boolean>(false);
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const otherVedleggLastesOpp =
        otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;
    const opplastingFeilet = harFilermedFeil(filer);

    const onLinkClicked = (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        setSendVedleggTrykket(false);
        const uploadElement: any = document.getElementById("file_andre");
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (event: any) => {
        const files: FileList | null = event.currentTarget.files;
        let sammensattFilstorrelse = 0;

        if (files) {
            const filerMedFeil: Array<FilFeil> = sjekkerFilFeil(files, 0, sammensattFilstorrelse);

            if (filerMedFeil.length === 0) {
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
                    dispatch({
                        type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_ETTERSENDELSE,
                        fil: {
                            filnavn: file.name,
                            status: "INITIALISERT",
                            file: file,
                        },
                    });
                }
            } else {
                setListeMedFilFeil(filerMedFeil);
            }
        }
        if (event.target.value === "") {
            return;
        }
        event.target.value = null;
        event.preventDefault();
    };

    const sendVedlegg = (event: any) => {
        if (!fiksDigisosId) {
            event.preventDefault();
            return;
        }

        let formData = opprettFormDataMedVedleggFraFiler(filer);
        const sti: InnsynsdataSti = InnsynsdataSti.VEDLEGG;
        const path = innsynsdataUrl(fiksDigisosId, sti);
        dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.PENDING));

        fetchPost(path, formData, "multipart/form-data")
            .then((filRespons: any) => {
                let harFeil: boolean = false;
                let vedlegg = filRespons[0].filer;
                if (Array.isArray(vedlegg)) {
                    for (let vedleggIndex = 0; vedleggIndex < vedlegg.length; vedleggIndex++) {
                        const fileItem = vedlegg[vedleggIndex];
                        if (fileItem.status !== "OK") {
                            harFeil = true;
                        }
                        dispatch({
                            type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_ETTERSENDELSESFIL,
                            fil: {filnavn: fileItem.filnavn} as Fil,
                            status: fileItem.status,
                            vedleggIndex: vedleggIndex,
                        });
                    }
                }
                if (harFeil) {
                    dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.FEILET));
                } else {
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
                    dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
                }
            })
            .catch((e) => {
                dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.FEILET));
                logErrorMessage("Feil med opplasting av vedlegg: " + e.message);
            });
        event.preventDefault();
    };

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggEnabled(kommuneResponse);

    return (
        <div>
            <DriftsmeldingVedlegg
                leserData={restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING}
            />
            <div
                className={
                    "oppgaver_detaljer " +
                    (opplastingFeilet || listeMedFilFeil.length > 0 || (!vedleggKlarForOpplasting && sendVedleggTrykket)
                        ? " oppgaver_detalj_feil_ramme"
                        : "")
                }
            >
                <div
                    className={
                        "oppgaver_detalj " +
                        (opplastingFeilet ||
                        listeMedFilFeil.length > 0 ||
                        (!vedleggKlarForOpplasting && sendVedleggTrykket)
                            ? " oppgaver_detalj_feil"
                            : "")
                    }
                    style={{marginTop: "0px"}}
                >
                    <Element>
                        <FormattedMessage id="andre_vedlegg.type" />
                    </Element>
                    <Normaltekst className="luft_over_4px">
                        <FormattedMessage id="andre_vedlegg.tilleggsinfo" />
                    </Normaltekst>

                    {filer &&
                        filer.length > 0 &&
                        filer.map((fil: Fil, vedleggIndex: number) => (
                            <FilView
                                key={vedleggIndex}
                                fil={fil}
                                vedleggIndex={vedleggIndex}
                                oppgaveElementIndex={0}
                                oppgaveIndex={0}
                            />
                        ))}

                    {kanLasteOppVedlegg && (
                        <div className="oppgaver_last_opp_fil">
                            <UploadFileIcon
                                className="last_opp_fil_ikon"
                                onClick={(event: any) => {
                                    onLinkClicked(event);
                                }}
                            />
                            <Lenke
                                href="#"
                                className="lenke_uten_ramme"
                                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                    onLinkClicked(event);
                                }}
                            >
                                <Element>
                                    <FormattedMessage id="vedlegg.velg_fil" />
                                </Element>
                            </Lenke>
                            <input
                                type="file"
                                id={"file_andre"}
                                multiple={true}
                                onChange={(event: ChangeEvent) => {
                                    onChange(event);
                                }}
                                style={{display: "none"}}
                            />
                        </div>
                    )}
                    {validerFilArrayForFeil(listeMedFilFeil) && skrivFeilmelding(listeMedFilFeil, 0)}
                </div>

                <Hovedknapp
                    disabled={!kanLasteOppVedlegg || vedleggLastesOpp || otherVedleggLastesOpp}
                    spinner={vedleggLastesOpp}
                    type="hoved"
                    className="luft_over_1rem"
                    onClick={(event: any) => {
                        if (!vedleggKlarForOpplasting) {
                            setSendVedleggTrykket(true);
                            return;
                        }
                        sendVedlegg(event);
                    }}
                >
                    <FormattedMessage id="andre_vedlegg.send_knapp_tittel" />
                </Hovedknapp>
            </div>
            {(opplastingFeilet || (!vedleggKlarForOpplasting && sendVedleggTrykket)) && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage
                        id={opplastingFeilet ? "vedlegg.opplasting_feilmelding" : "vedlegg.minst_ett_vedlegg"}
                    />
                </div>
            )}
        </div>
    );
};

export default EttersendelseView;
