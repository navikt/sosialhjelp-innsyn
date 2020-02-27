import React, {useState} from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import UploadFileIcon from "../ikoner/UploadFile";
import {
    Fil,
    InnsynsdataActionTypeKeys,
    KommuneResponse,
    Oppgave,
    OppgaveElement,
    Vedlegg
} from "../../redux/innsynsdata/innsynsdataReducer";
import VedleggActionsView from "./VedleggActionsView";
import FilView from "./FilView";
import {useDispatch, useSelector} from "react-redux";
import {OriginalSoknadVedleggType} from "../../redux/soknadsdata/vedleggTypes";
import {originalSoknadVedleggTekstVisning} from "../../redux/soknadsdata/vedleggskravVisningConfig";
import {FormattedMessage} from "react-intl";
import {InnsynAppState} from "../../redux/reduxTypes";
import {erOpplastingAvVedleggEnabled} from "../driftsmelding/DriftsmeldingUtilities";
import {setOppgaveVedleggopplastingFeilet} from "../../redux/innsynsdata/innsynsDataActions";
import {antallDagerEtterFrist} from "./Oppgaver";
import {formatDato} from "../../utils/formatting";
import {containsUlovligeTegn} from "../../utils/vedleggUtils";

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
    let typeTekst,
        tilleggsinfoTekst,
        sammensattType = type + "|" + tilleggsinfo,
        erOriginalSoknadVedleggType = Object.values(OriginalSoknadVedleggType).some(val => val === sammensattType);

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

const harFilermedFeil = (oppgaveElementer: OppgaveElement[]) => {
    return oppgaveElementer.find(
        oppgaveElement => {
            return !oppgaveElement.filer ? false : oppgaveElement.filer.find(
                it => {
                    return it.status !== "OK" && it.status !== "PENDING" && it.status !== "INITIALISERT"
                }
            )
        }
    );
};

function skrivFeilmelding(ulovligFiltypeOppgaveIndex: any, ulovligFilnavnOppgaveIndex: any, ulovligFilstorrelseOppgaveIndex: any, ulovligStorrelseAvFilerOppgaveIndex: any, oppgaveBoksIndex: any, id: number){
    return (
        <ul>
            {(oppgaveBoksIndex === id && (ulovligStorrelseAvFilerOppgaveIndex === id || ulovligFilstorrelseOppgaveIndex === id || ulovligFiltypeOppgaveIndex === id || ulovligFilnavnOppgaveIndex === id)) && (
                <div className="oppgaver_vedlegg_feilmelding">
                    <FormattedMessage id="vedlegg.ulovlig_fil_feilmelding"/>
                </div>
            )}
            {(ulovligFilnavnOppgaveIndex === id) && (
                <li>
                    <div className="oppgaver_vedlegg_feilmelding">
                        <FormattedMessage id="vedlegg.ulovlig_filnavn_feilmelding"/>
                    </div>
                </li>
            )}
            {(ulovligFiltypeOppgaveIndex === id) && (
                <li>
                    <div className="oppgaver_vedlegg_feilmelding">
                        <FormattedMessage id="vedlegg.ulovlig_filtype_feilmelding"/>
                    </div>
                </li>
            )}
            {(ulovligFilstorrelseOppgaveIndex === id) && (
                <li>
                    <div className="oppgaver_vedlegg_feilmelding">
                        <FormattedMessage id="vedlegg.ulovlig_filstorrelse_feilmelding"/>
                    </div>
                </li>
            )}
            {(ulovligStorrelseAvFilerOppgaveIndex === id) && (
                <li>
                    <div className="oppgaver_vedlegg_feilmelding">
                        <FormattedMessage id="vedlegg.ulovlig_storrelse_av_alle_valgte_filer"/>
                    </div>
                </li>
            )}
        </ul>
    );
}

const OppgaveView: React.FC<Props> = ({oppgave, oppgaverErFraInnsyn, oppgaveIndex}) => {

    const dispatch = useDispatch();
    const [ulovligFiltypeOppgaveIndex, setUlovligFiltypeOppgaveIndex] = useState<number>(-1);
    const [ulovligFilnavnOppgaveIndex, setUlovligeFilnavnOppgaveIndex] = useState<number>(-1);
    const [ulovligFilstorrelseOppgaveIndex, setUlovligFilstorrelseOppgaveIndex] = useState<number>(-1);
    const [ulovligStorrelseAvFilerOppgaveIndex, setUlovligStorrelseAvFilerOppgaveIndex] = useState<number>(-1);
    const [oppgaveBoksIndex, setOppgaveBoksIndex] = useState<number>(-1);
    const oppgaveVedlegsOpplastingFeilet: boolean = useSelector((state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet);
    let kommuneResponse: KommuneResponse | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.kommune);
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggEnabled(kommuneResponse);
    const opplastingFeilet = harFilermedFeil(oppgave.oppgaveElementer);
    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(oppgave.innsendelsesfrist!!));

    const onLinkClicked = (id: number, event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        let handleOnLinkClicked = (response: boolean) => {
            dispatch(setOppgaveVedleggopplastingFeilet(response));
        };
        if (handleOnLinkClicked) {
            handleOnLinkClicked(false);
        }
        const uploadElement: any = document.getElementById('file_' + oppgaveIndex + '_' + id);
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (event: any, oppgaveElement: OppgaveElement, oppgaveIndex: number) => {
        const files: FileList | null = event.currentTarget.files;
        setUlovligFiltypeOppgaveIndex(-1);
        setUlovligeFilnavnOppgaveIndex(-1);
        setUlovligFilstorrelseOppgaveIndex(-1);
        setUlovligStorrelseAvFilerOppgaveIndex(-1);
        setOppgaveBoksIndex(-1);
        const maxFilStorrelse = 10*1024*1024;
        const maxSammensattFilStorrelse = 350*1024*1024;
        let filerErGyldig = true;
        let storrelsePaaAntallFiler = 0;

        if (files) {
            for(let index = 0; index  < files.length; index++){
                const file: File = files[index];
                const filename = file.name;

                if (!legalFileExtension(filename)) {
                    setUlovligFiltypeOppgaveIndex(oppgaveIndex);
                    setOppgaveBoksIndex(oppgaveIndex);
                    filerErGyldig = false;
                }
                if (containsUlovligeTegn(filename)) {
                    setUlovligeFilnavnOppgaveIndex(oppgaveIndex);
                    setOppgaveBoksIndex(oppgaveIndex);
                    filerErGyldig = false;
                }
                if(file.size > maxFilStorrelse){
                    setUlovligFilstorrelseOppgaveIndex(oppgaveIndex);
                    setOppgaveBoksIndex(oppgaveIndex);
                    filerErGyldig = false;
                }
                if(storrelsePaaAntallFiler > maxSammensattFilStorrelse){
                    setUlovligStorrelseAvFilerOppgaveIndex(oppgaveIndex);
                    setOppgaveBoksIndex(oppgaveIndex);
                    filerErGyldig = false;
                }
                storrelsePaaAntallFiler += file.size;
            }

            if(filerErGyldig){
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
                    dispatch({
                        type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                        oppgaveElement: oppgaveElement,
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

    function getOppgaveDetaljer(typeTekst: string, tilleggsinfoTekst: string | undefined, oppgaveElement: OppgaveElement, id: number): JSX.Element {
        const visOppgaverDetaljeFeil: boolean = (oppgaveVedlegsOpplastingFeilet || opplastingFeilet !== undefined || oppgaveBoksIndex === id
            || ulovligFiltypeOppgaveIndex === id || ulovligFilnavnOppgaveIndex ===  id
            || ulovligFilstorrelseOppgaveIndex === id || ulovligStorrelseAvFilerOppgaveIndex === id);
        return (
            <div key={id}
                 className={"oppgaver_detalj" + ((visOppgaverDetaljeFeil) ? " oppgaver_detalj_feil" : "")}>
                <div className={"oppgave-detalj-overste-linje"}>
                    <div className={"tekst-wrapping"}>
                        <Element>{typeTekst}</Element>
                    </div>
                    {tilleggsinfoTekst && (
                        <div className={"tekst-wrapping"}>
                            <Normaltekst className="luft_over_4px">
                                {tilleggsinfoTekst}
                            </Normaltekst>
                        </div>
                    )}
                    {kanLasteOppVedlegg && (
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
                                onChange={(event: ChangeEvent) => onChange(event, oppgaveElement, id)}
                                style={{display: "none"}}
                            />
                        </div>
                    )}
                </div>

                {oppgaveElement.vedlegg && oppgaveElement.vedlegg.length > 0 && oppgaveElement.vedlegg.map((vedlegg: Vedlegg, index: number) =>
                    <VedleggActionsView vedlegg={vedlegg} key={index}/>
                )}

                {oppgaveElement.filer && oppgaveElement.filer.length > 0 && oppgaveElement.filer.map((fil: Fil, index: number) =>
                    <FilView key={index} fil={fil} oppgaveElement={oppgaveElement} index={index}/>
                )}

                {(ulovligFiltypeOppgaveIndex > -1 || ulovligFilnavnOppgaveIndex > -1 || ulovligFilstorrelseOppgaveIndex > -1 || ulovligStorrelseAvFilerOppgaveIndex > -1 || oppgaveBoksIndex > -1) && (
                    skrivFeilmelding(ulovligFiltypeOppgaveIndex, ulovligFilnavnOppgaveIndex, ulovligFilstorrelseOppgaveIndex, ulovligStorrelseAvFilerOppgaveIndex, oppgaveBoksIndex, id)
                )}
            </div>
        );
    }

    const visOppgaverDetaljeFeil: boolean = (oppgaveVedlegsOpplastingFeilet || opplastingFeilet !== undefined
        || ulovligFiltypeOppgaveIndex > -1 || ulovligFilnavnOppgaveIndex > -1 || ulovligFilstorrelseOppgaveIndex > -1
        || ulovligStorrelseAvFilerOppgaveIndex > -1);
    return (
        <div className={((visOppgaverDetaljeFeil)
            ? "oppgaver_detaljer_feil_ramme" : "oppgaver_detaljer") + " luft_over_1rem"}>
            {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert <= 0 &&(
                <Normaltekst className="luft_under_8px">
                    <FormattedMessage
                        id="oppgaver.innsendelsesfrist"
                        values={{innsendelsesfrist: formatDato(oppgave.innsendelsesfrist!)}}
                    />
                </Normaltekst>
            )}
            {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert > 0 &&(
                <Normaltekst className="luft_under_8px">
                    <FormattedMessage
                        id="oppgaver.innsendelsesfrist_passert"
                        values={{innsendelsesfrist: formatDato(oppgave.innsendelsesfrist!)}}
                    />
                </Normaltekst>
            )}
            {oppgave.oppgaveElementer.map((oppgaveElement, index) => {
                    let {typeTekst, tilleggsinfoTekst} = getVisningstekster(oppgaveElement.dokumenttype, oppgaveElement.tilleggsinformasjon);
                    return getOppgaveDetaljer(typeTekst, tilleggsinfoTekst, oppgaveElement, index);
                }
            )}
            {(oppgaveVedlegsOpplastingFeilet || opplastingFeilet) && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={oppgaveVedlegsOpplastingFeilet ? "vedlegg.minst_ett_vedlegg" : "vedlegg.opplasting_feilmelding"}/>
                </div>
            )}
        </div>
    )
};

export default OppgaveView;

