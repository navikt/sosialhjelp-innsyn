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
import {hentInnsynsdata, innsynsdataUrl, logErrorMessage} from "../../redux/innsynsdata/innsynsDataActions";
import {fetchPost, REST_STATUS} from "../../utils/restUtils";
import {
    containsUlovligeTegn,
    maxFilStorrelse,
    maxSammensattFilStorrelse,
    opprettFormDataMedVedleggFraFiler
} from "../../utils/vedleggUtils";
import {erOpplastingAvVedleggEnabled} from "../driftsmelding/DriftsmeldingUtilities";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";


function harFilermedFeil(filer: Fil[]) {
    return filer.find(
        it => {
            return it.status !== "OK" && it.status !== "PENDING" && it.status !== "INITIALISERT"
        }
    )
}

const EttersendelseView: React.FC = () => {

    const dispatch = useDispatch();
    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);
    const [isUlovligFiltype, setUlovligFiltype] = useState(false);
    const [isUlovligFilnavn, setUlovligFilnavn] = useState(false);
    const [isUlovligFilstorrelse, setUlovligFilstorrelse] = useState(false);
    const [isUlovligStorrelseAvFiler, setUlovligStorrelseAvFiler] = useState(false);
    const filer: Fil[] = useSelector((state: InnsynAppState) => state.innsynsdata.ettersendelse.filer);
    //const feil: Vedleggfeil | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.ettersendelse.feil);
    const vedleggKlarForOpplasting = filer.length > 0;
    const [sendVedleggTrykket, setSendVedleggTrykket] = useState<boolean>(false);
    const restStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.vedlegg);
    const vedleggLastesOpp = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const otherRestStatus = useSelector((state: InnsynAppState) => state.innsynsdata.restStatus.oppgaver);
    const otherVedleggLastesOpp = otherRestStatus === REST_STATUS.INITIALISERT || otherRestStatus === REST_STATUS.PENDING;
    const opplastingFeilet = harFilermedFeil(filer);

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
        setUlovligFiltype(false);
        setUlovligFilnavn(false);
        setUlovligFilstorrelse(false);
        setUlovligStorrelseAvFiler(false);
        let sammensattFilstorrelse = 0;
        let filerErGyldig = true;

        if (files) {
            for (let index = 0; index < files.length; index++) {
                const file: File = files[index];
                const filename = file.name;

                if (!legalFileExtension(filename)) {
                    setUlovligFiltype(true);
                    filerErGyldig = false;
                }
                if (containsUlovligeTegn(filename)) {
                    setUlovligFilnavn(true);
                    filerErGyldig = false;
                }
                if(file.size > maxFilStorrelse){
                    setUlovligFilstorrelse(true);
                    filerErGyldig = false;
                }
                if(sammensattFilstorrelse > maxSammensattFilStorrelse){
                    setUlovligStorrelseAvFiler(true);
                    filerErGyldig = false;
                }
                sammensattFilstorrelse += file.size;
            }

            if(filerErGyldig) {
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
                    dispatch({
                        type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_ETTERSENDELSE,
                        fil: {
                            filnavn: file.name,
                            status: "INITIALISERT",
                            file: file
                        }
                    });
                }
            }
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
                        status: fileItem.status,
                        index: index
                    });
                }
            }
            if (harFeil) {
                dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.FEILET));
            } else {
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
            }
        }).catch((e) => {
            logErrorMessage("Feil med opplasting av vedlegg: " + e.message);
        });
        event.preventDefault()
    };

    let kommuneResponse: KommuneResponse | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.kommune);
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggEnabled(kommuneResponse);

    return (
        <div>
            <DriftsmeldingVedlegg leserData={restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING}/>
            <div
                className={"oppgaver_detaljer " + (opplastingFeilet || isUlovligFiltype || isUlovligFilnavn || isUlovligFilstorrelse || isUlovligStorrelseAvFiler || (!vedleggKlarForOpplasting && sendVedleggTrykket) ? " oppgaver_detalj_feil_ramme" : "")}>
                <div
                    className={"oppgaver_detalj " + (opplastingFeilet || isUlovligFiltype || isUlovligFilnavn || isUlovligFilstorrelse || isUlovligStorrelseAvFiler || (!vedleggKlarForOpplasting && sendVedleggTrykket) ? " oppgaver_detalj_feil" : "")}
                    style={{marginTop: "0px"}}
                >
                    <Element><FormattedMessage id="andre_vedlegg.type"/></Element>
                    <Normaltekst className="luft_over_4px">
                        <FormattedMessage id="andre_vedlegg.tilleggsinfo"/>
                    </Normaltekst>

                    {filer && filer.length > 0 && filer.map((fil: Fil, index: number) =>
                        <FilView key={index} fil={fil} index={index}/>
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

                    <ul>

                    {(isUlovligFiltype || isUlovligFilnavn || isUlovligFilstorrelse || isUlovligStorrelseAvFiler) && (
                        <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                            <FormattedMessage id="vedlegg.ulovlig_fil_feilmelding"/>
                        </div>
                    )}

                    {isUlovligFiltype && (
                        <li>
                            <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                                <FormattedMessage id="vedlegg.ulovlig_filtype_feilmelding"/>
                            </div>
                        </li>
                    )}

                    {isUlovligFilnavn && (
                        <li>
                            <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                                <FormattedMessage id="vedlegg.ulovlig_filnavn_feilmelding"/>
                            </div>
                        </li>
                    )}

                    {isUlovligFilstorrelse && (
                        <li>
                            <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                                <FormattedMessage id="vedlegg.ulovlig_filstorrelse_feilmelding"/>
                            </div>
                        </li>
                    )}
                    {isUlovligStorrelseAvFiler && (
                        <li>
                            <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                                <FormattedMessage id="vedlegg.ulovlig_storrelse_av_alle_valgte_filer"/>
                            </div>
                        </li>
                    )}
                    </ul>
                </div>

                {opplastingFeilet && (
                    <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                        <FormattedMessage id="vedlegg.opplasting_feilmelding"/>
                    </div>
                )}

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