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
import {containsUloveligeTegn} from "../../utils/vedleggUtils";

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
//function harFilermedFeil (oppgaveElementer: OppgaveElement[]) {
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
}

function skrivFeilmelding(ulovligFiltypeOppgaveIndex: any, ulovligFilnavnOppgaveIndex: any, ulovligFilstorrelseOppgaveIndex: any, id: number){
    //console.log("skrivfeilmelding type", ulovligFiltypeOppgaveIndex);
    //console.log("skrivfeilmelding filnavn", ulovligFilnavnOppgaveIndex);
    //console.log("skrivfeilmelding størrelse", ulovligFilstorrelseOppgaveIndex);
    return (
        <ul>
            <div className="oppgaver_vedlegg_feilmelding">
                <FormattedMessage id="vedlegg.ulovlig_fil_feilmelding"/>
            </div>
            {(ulovligFilstorrelseOppgaveIndex === id) && (
                <li>
                    <div className="oppgaver_vedlegg_feilmelding">
                        <FormattedMessage id="vedlegg.ulovlig_filstorrelse_feilmelding"/>
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
            {(ulovligFilnavnOppgaveIndex === id) && (
                <li>
                    <div className="oppgaver_vedlegg_feilmelding">
                        <FormattedMessage id="vedlegg.ulovlig_filnavn_feilmelding"/>
                    </div>
                </li>
            )}
        </ul>
    );
}

//function kanLasteOppvedlegg( oppgaveElement: OppgaveElement, oppgaveIndex: any, id: number, onLinkClicked: any, onChange: any, event: any){
//    return(
//        id
//    );
//}

const OppgaveView: React.FC<Props> = ({oppgave, oppgaverErFraInnsyn, oppgaveIndex}) => {

    const dispatch = useDispatch();

    const [ulovligFiltypeOppgaveIndex, setUlovligFiltypeOppgaveIndex] = useState<number>(-1);
    const [ulovligFilnavnOppgaveIndex, setUlovligeFilnavnOppgaveIndex] = useState<number>(-1);
    const [ulovligFilstorrelseOppgaveIndex, setUlovligFilstorrelseOppgaveIndex] = useState<number>(-1);

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
        const maxFilStorrelse = 10*1024*1024;

        //console.log("max size", maxFilStorrelse);

        console.log("onChnage type før if ", ulovligFiltypeOppgaveIndex);
        console.log("onChange filnavn før if ", ulovligFilnavnOppgaveIndex);
        console.log("onChange størrelse før if ", ulovligFilstorrelseOppgaveIndex);

        if (files) {

            //skal bare brukes til å validere hver fil og deretter legge det til en const
            //deretter sendes dette til neste for
            //for(let index = 0; index  < files.length; index++){
            //
            //}

            //skal brukes til å validere om noen av filene i den insendte const er feil.
            //om en eller flere av filene er feile så skal ingen av filene lastes opp
            //også skal feilmeldingen bli skrevet ut
            for (let index = 0; index < files.length; index++) {
                const file: File = files[index];
                const filename = file.name;
                console.log(" ");
                console.log("filename: ", filename);
                console.log(" ");

                if (!legalFileExtension(filename)) {
                    //console.log("legalFileExtension");
                    setUlovligFiltypeOppgaveIndex(oppgaveIndex);
                    console.log("onChange filnavn innenfor if", ulovligFilnavnOppgaveIndex);
                }
                //else if
                if (containsUloveligeTegn(filename, ["*", ":", "<", ">", "|", "?", "\\", "/"])) {
                    //console.log("containsUloveligeTegn");
                    setUlovligeFilnavnOppgaveIndex(oppgaveIndex);
                    console.log("onChange type innenfor if", ulovligFiltypeOppgaveIndex);
                }

                //console.log("size", file.size);
                //console.log("oppgaveindex",oppgaveIndex);
                //else if
                if(file.size > maxFilStorrelse){
                    //console.log("file.size");
                    setUlovligFilstorrelseOppgaveIndex(oppgaveIndex);
                    console.log("onChange størrelse innenfor if", ulovligFilstorrelseOppgaveIndex);
                }
                console.log(" ");
                console.log("onChnage type utenfor if ", ulovligFiltypeOppgaveIndex);
                console.log("onChange filnavn utenfor if ", ulovligFilnavnOppgaveIndex);
                console.log("onChange størrelse utenfor if ", ulovligFilstorrelseOppgaveIndex);
                console.log(" ");

                if(legalFileExtension(filename) && !containsUloveligeTegn(filename,["*", ":", "<", ">", "|", "?", "\\", "/"])  && !(file.size > maxFilStorrelse)){
                    //else{
                    console.log("DISPATCH");
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
        const visOppgaverDetaljeFeil: boolean = (oppgaveVedlegsOpplastingFeilet === true || opplastingFeilet !== undefined ||
            ulovligFiltypeOppgaveIndex === id || ulovligFilnavnOppgaveIndex ===  id || ulovligFilstorrelseOppgaveIndex === id);
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
                        //kanLasteOppvedlegg(oppgaveIndex,id)
                        /*
                        * REFACTOR DETTE TIL EN FUNKSJON
                        * */
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

                {(ulovligFiltypeOppgaveIndex > -1 || ulovligFilnavnOppgaveIndex > -1 || ulovligFilstorrelseOppgaveIndex > -1) && (
                    skrivFeilmelding(ulovligFiltypeOppgaveIndex, ulovligFilnavnOppgaveIndex, ulovligFilstorrelseOppgaveIndex, id)
                )}
            </div>
        );
    }

    const visOppgaverDetaljeFeil: boolean = (oppgaveVedlegsOpplastingFeilet === true || opplastingFeilet !== undefined ||
        ulovligFiltypeOppgaveIndex > -1 || ulovligFilnavnOppgaveIndex > -1 || ulovligFilstorrelseOppgaveIndex > -1);
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

