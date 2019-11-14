import React, {useState} from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import UploadFileIcon from "../ikoner/UploadFile";
import {
    Fil,
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    Oppgave,
    OppgaveElement,
    settRestStatus,
    Vedlegg
} from "../../redux/innsynsdata/innsynsdataReducer";
import VedleggActionsView from "./VedleggActionsView";
import FilView from "./FilView";
import {useDispatch, useSelector} from "react-redux";
import {OriginalSoknadVedleggType} from "../../redux/soknadsdata/vedleggTypes";
import {originalSoknadVedleggTekstVisning} from "../../redux/soknadsdata/vedleggskravVisningConfig";
import {FormattedMessage} from "react-intl";
import {Hovedknapp} from "nav-frontend-knapper";
import {opprettFormDataMedVedleggFraOppgaver} from "../../utils/vedleggUtils";
import {hentInnsynsdata, innsynsdataUrl} from "../../redux/innsynsdata/innsynsDataActions";
import {fetchPost, REST_STATUS} from "../../utils/restUtils";
import {InnsynAppState} from "../../redux/reduxTypes";

interface Props {
    oppgave: Oppgave;
    oppgaverErFraInnsyn: boolean;
    oppgaveIndex: any;
}

export const legalFileExtension = (filename: string): boolean => {
    const fileExtension = filename.replace(/^.*\./, '');
    return fileExtension.match(/jpe?g|png|pdf/i) !== null;
};

type ChangeEvent = React.FormEvent<HTMLInputElement>;

export const getVisningstekster = (type: string, tilleggsinfo: string | undefined) => {
    let typeTekst;
    let tilleggsinfoTekst;
    let sammensattType = type + "|" + tilleggsinfo;
    let erOriginalSoknadVedleggType = Object.values(OriginalSoknadVedleggType).some(val => val === sammensattType);
    if (erOriginalSoknadVedleggType) {
        let soknadVedleggSpec = originalSoknadVedleggTekstVisning.find(spc => spc.type === sammensattType)!!;
        typeTekst = soknadVedleggSpec.tittel;
        tilleggsinfoTekst = soknadVedleggSpec.tilleggsinfo;
    } else {
        typeTekst = type;
        tilleggsinfoTekst = tilleggsinfo;
    }
    return {typeTekst, tilleggsinfoTekst};
};

function antallVedlegg(oppgave: Oppgave) {
    let antall = 0;
    oppgave && oppgave.oppgaveElementer.forEach((oppgaveElement: OppgaveElement) => {
        oppgaveElement.filer && oppgaveElement.filer.forEach((fil: Fil) => {
            antall += 1;
        });
    });
    return antall;
}

const OppgaveView: React.FC<Props> = ({oppgave, oppgaverErFraInnsyn, oppgaveIndex}) => {

    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);
    const dispatch = useDispatch();

    const [antallUlovligeFiler, setAntallUlovligeFiler] = useState(0);
    const vedleggKlarForOpplasting = oppgave !== null && antallVedlegg(oppgave) > 0;

    const onLinkClicked = (id: number, event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        const uploadElement: any = document.getElementById('file_' + oppgaveIndex + '_' + id);
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (event: any, opp: OppgaveElement) => {
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            let ulovligeFilerCount = 0;
            for (let index = 0; index < files.length; index++) {
                const file: File = files[index];
                const filename = file.name;
                if (legalFileExtension(filename)) {
                    dispatch({
                        type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                        oppgaveElement: opp,
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
        if (oppgave === null || !fiksDigisosId) {
            event.preventDefault();
            return;
        }

        let formData = opprettFormDataMedVedleggFraOppgaver(oppgave);
        const sti: InnsynsdataSti = InnsynsdataSti.SEND_VEDLEGG;
        const path = innsynsdataUrl(fiksDigisosId, sti);
        dispatch(settRestStatus(InnsynsdataSti.VEDLEGG, REST_STATUS.PENDING));

        fetchPost(path, formData, "multipart/form-data").then((filRespons: any) => {
            let harFeil: boolean = false;
            if (Array.isArray(filRespons)) {
                for (var index = 0; index < filRespons.length; index++) {
                    const fileItem = filRespons[index];
                    if (fileItem.status !== "OK") {
                        harFeil = true;
                    }
                    dispatch({
                        type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_FIL,
                        fil: {
                            filnavn: fileItem.filnavn,
                            status: fileItem.status,
                        } as Fil,
                    });
                }
            }
            if (!harFeil) {
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.OPPGAVER));
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
                dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
            }
        }).catch((reason: any) => {
            console.log("Feil med opplasting av vedlegg");
        });

        event.preventDefault()
    };

    function getOppgaveDetaljer(typeTekst: string, tilleggsinfoTekst: string | undefined, oppgaveElement: OppgaveElement, id: number): JSX.Element {
        return (
            <>
                <div className={"oppgaver_detalj" + (antallUlovligeFiler > 0 ? " oppgaver_detalj_feil" : "")}>
                    <Element>{typeTekst}</Element>
                    {tilleggsinfoTekst && (
                        <Normaltekst className="luft_over_4px">
                            {tilleggsinfoTekst}
                        </Normaltekst>)}

                    {oppgaveElement.vedlegg && oppgaveElement.vedlegg.length > 0 && oppgaveElement.vedlegg.map((vedlegg: Vedlegg, index: number) =>
                        <VedleggActionsView vedlegg={vedlegg} key={index}/>
                    )}

                    {oppgaveElement.filer && oppgaveElement.filer.length > 0 && oppgaveElement.filer.map((fil: Fil, index: number) =>
                        <FilView key={index} fil={fil} oppgaveElement={oppgaveElement}/>
                    )}

                    <div className="oppgaver_last_opp_fil">
                        <UploadFileIcon
                            className="last_opp_fil_ikon"
                            onClick={(event: any) => {
                                onLinkClicked(id, event)
                            }}
                        />
                        <Lenke
                            href="#"
                            id={"oppgave_" + id + "_last_opp_fil_knapp"}
                            className="lenke_uten_ramme"
                            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                onLinkClicked(id, event)
                            }}
                        >
                            <Element>
                                <FormattedMessage id="vedlegg.velg_fil"/>
                            </Element>
                        </Lenke>
                        <input
                            type="file"
                            id={'file_' + oppgaveIndex + '_' + id}
                            multiple={true}
                            onChange={(event: ChangeEvent) => onChange(event, oppgaveElement)}
                            style={{display: "none"}}
                        />
                    </div>

                </div>
            </>
        );
    }

    return (
        <>
            <div className="oppgaver_detaljer luft_over_1rem">
                {oppgaverErFraInnsyn && (
                    <Normaltekst className="luft_under_8px">
                        <FormattedMessage
                            id="oppgaver.innsendelsesfrist"
                            values={{innsendelsesfrist: new Date(oppgave.innsendelsesfrist!!).toLocaleDateString()}}
                        />
                    </Normaltekst>
                )}

                {oppgave.oppgaveElementer.map((oppgaveElement, index) => {
                        let {typeTekst, tilleggsinfoTekst} = getVisningstekster(oppgaveElement.dokumenttype, oppgaveElement.tilleggsinformasjon);

                        return getOppgaveDetaljer(typeTekst, tilleggsinfoTekst, oppgaveElement, index);
                    }
                )}

                {antallUlovligeFiler > 0 && (
                    <div className="oppgaver_vedlegg_feilmelding">
                        <FormattedMessage id="vedlegg.lovlig_filtype_feilmelding"/>
                    </div>
                )}

                <Hovedknapp
                    disabled={!vedleggKlarForOpplasting}
                    type="hoved"
                    className="luft_over_1rem"
                    onClick={(event: any) => sendVedlegg(event)}
                >
                    <FormattedMessage id="oppgaver.send_knapp_tittel"/>
                </Hovedknapp>

            </div>
        </>
    )
};

export default OppgaveView;
