import React, {ChangeEvent, useState} from "react"
import {Element, Normaltekst} from "nav-frontend-typografi";
import {
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    settRestStatus,
    KommuneResponse
} from "../../redux/innsynsdata/innsynsdataReducer";
import FilView from "../oppgaver/FilView";
import UploadFileIcon from "../ikoner/UploadFile";
import Lenke from "nav-frontend-lenker";
import {FormattedMessage} from "react-intl";
import {legalFileExtension} from "../oppgaver/OppgaveView";
import {Hovedknapp} from "nav-frontend-knapper";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {hentInnsynsdata, innsynsdataUrl} from "../../redux/innsynsdata/innsynsDataActions";
import {fetchPost, REST_STATUS} from "../../utils/restUtils";
import {opprettFormDataMedVedleggFraFiler} from "../../utils/vedleggUtils";
import {erOpplastingAvVedleggEnabled} from "../driftsmelding/DriftsmeldingUtilities";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";

const EttersendelseView: React.FC = () => {

    const dispatch = useDispatch();
    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);
    const [antallUlovligeFiler, setAntallUlovligeFiler] = useState(0);
    const filer: Fil[] = useSelector((state: InnsynAppState) => state.innsynsdata.ettersendelse.filer);
    //const feil: Vedleggfeil | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.ettersendelse.feil);
    const vedleggKlarForOpplasting = filer.length > 0;
    const [sendVedleggTrykket, setSendVedleggTrykket] = useState<boolean>(false);
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;

    const onLinkClicked = (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        setSendVedleggTrykket(false);
        const uploadElement: any = document.getElementById('file_andre');
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (event: any) => {
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            let ulovligeFilerCount = 0;
            for (let index = 0; index < files.length; index++) {
                const file: File = files[index];
                const filename = file.name;
                if (legalFileExtension(filename)) {
                    dispatch({
                        type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_ETTERSENDELSE,
                        fil: {
                            filnavn: file.name,
                            status: "INITIALISERT",
                            file: file
                        }
                    });
                } else {
                    ulovligeFilerCount += 1;
                }
            }
            setAntallUlovligeFiler(ulovligeFilerCount);
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
        const sti: InnsynsdataSti = InnsynsdataSti.SEND_VEDLEGG;
        const path = innsynsdataUrl(fiksDigisosId, sti);
        dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.PENDING));

        fetchPost(path, formData, "multipart/form-data").then((filRespons: any) => {
            let harFeil: boolean = false;
            if (Array.isArray(filRespons)) {
                for (let index = 0; index < filRespons.length; index++) {
                    const fileItem = filRespons[index];
                    if (fileItem.status !== "OK") {
                        harFeil = true;
                    }
                    dispatch({
                        type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_ETTERSENDELSESFIL,
                        fil: {filnavn: fileItem.filnavn} as Fil,
                        status: fileItem.status
                    });
                }
            }
            if (!harFeil) {
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
            }
        }).catch((reason: any) => {
            console.log("Feil med opplasting av vedlegg");
        });
        event.preventDefault()
    };

    let kommuneResponse: KommuneResponse | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.kommune);
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggEnabled(kommuneResponse);

    return (
        <div>
            <DriftsmeldingVedlegg/>
            <div
                className={"oppgaver_detaljer " + (antallUlovligeFiler > 0 || (!vedleggKlarForOpplasting && sendVedleggTrykket) ? " oppgaver_detalj_feil_ramme" : "")}>
                <div
                    className={"oppgaver_detalj " + (antallUlovligeFiler > 0 || (!vedleggKlarForOpplasting && sendVedleggTrykket) ? " oppgaver_detalj_feil" : "")}
                    style={{marginTop: "0px"}}
                >
                    <Element><FormattedMessage id="andre_vedlegg.type"/></Element>
                    <Normaltekst className="luft_over_4px">
                        <FormattedMessage id="andre_vedlegg.tilleggsinfo"/>
                    </Normaltekst>

                    {filer && filer.length > 0 && filer.map((fil: Fil, index: number) =>
                        <FilView key={index} fil={fil}/>
                    )}

                    {kanLasteOppVedlegg && (
                        <div className="oppgaver_last_opp_fil">
                            <UploadFileIcon
                                className="last_opp_fil_ikon"
                                onClick={(event: any) => {
                                    onLinkClicked(event)
                                }}
                            />
                            <Lenke
                                href="#"
                                className="lenke_uten_ramme"
                                onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                    onLinkClicked(event)
                                }}
                            >
                                <Element>
                                    <FormattedMessage id="vedlegg.velg_fil"/>
                                </Element>
                            </Lenke>
                            <input
                                type="file"
                                id={'file_andre'}
                                multiple={true}
                                onChange={(event: ChangeEvent) => {
                                    onChange(event)
                                }}
                                style={{display: "none"}}
                            />
                        </div>
                    )}

                </div>

                {antallUlovligeFiler > 0 && (
                    <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                        <FormattedMessage id="vedlegg.lovlig_filtype_feilmelding"/>
                    </div>
                )}

                {/* TODO: Ta stilling til om/hvordan dupliserte filer skal håndteres */}
                {/*{feil !== undefined && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={(feil as Vedleggfeil).feilmeldingId} values={{filnavn: (feil as Vedleggfeil).filnavn}}/>
                </div>
            )}*/}

                <Hovedknapp
                    disabled={!kanLasteOppVedlegg || vedleggLastesOpp}
                    spinner={vedleggLastesOpp}
                    type="hoved"
                    className="luft_over_1rem"
                    onClick={(event: any) => {
                        if (!vedleggKlarForOpplasting) {
                            setSendVedleggTrykket(true)
                            return;
                        }
                        sendVedlegg(event)
                    }}
                >
                    <FormattedMessage id="andre_vedlegg.send_knapp_tittel"/>

                </Hovedknapp>
            </div>
            {(!vedleggKlarForOpplasting && sendVedleggTrykket) && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id="vedlegg.minst_ett_vedlegg"/>
                </div>
            )}
        </div>
    )
};

export default EttersendelseView;