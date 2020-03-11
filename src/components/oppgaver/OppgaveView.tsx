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
    Vedlegg,
} from "../../redux/innsynsdata/innsynsdataReducer";
import VedleggActionsView from "./VedleggActionsView";
import FilView from "./FilView";
import {useDispatch, useSelector} from "react-redux";
import {OriginalSoknadVedleggType} from "../../redux/soknadsdata/vedleggTypes";
import {originalSoknadVedleggTekstVisning} from "../../redux/soknadsdata/vedleggskravVisningConfig";
import {FormattedMessage} from "react-intl";
import {InnsynAppState} from "../../redux/reduxTypes";
import {erOpplastingAvVedleggEnabled} from "../driftsmelding/DriftsmeldingUtilities";
import {logInfoMessage, setOppgaveVedleggopplastingFeilet} from "../../redux/innsynsdata/innsynsDataActions";
import {antallDagerEtterFrist} from "./Oppgaver";
import {formatDato} from "../../utils/formatting";
import {
    containsUlovligeTegn,
    legalCombinedFilesSize,
    legalFileSize,
    legalFileExtension,
    FilFeil,
} from "../../utils/vedleggUtils";

interface Props {
    oppgave: Oppgave;
    oppgaverErFraInnsyn: boolean;
    oppgaveIndex: any;
}

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

const harFilerMedFeil = (oppgaveElementer: OppgaveElement[]) => {
    return oppgaveElementer.find(oppgaveElement => {
        return !oppgaveElement.filer
            ? false
            : oppgaveElement.filer.find(it => {
                  return it.status !== "OK" && it.status !== "PENDING" && it.status !== "INITIALISERT";
              });
    });
};

const feilmeldingComponentTittel = (feilId: string, filnavn: string, listeMedFil: any) => {
    if (listeMedFil.length > 1) {
        return (
            <div className="oppgaver_vedlegg_feilmelding">
                <FormattedMessage id={feilId} values={{antallFiler: listeMedFil.length}} />
            </div>
        );
    } else if (listeMedFil.length === 1) {
        return (
            <div className="oppgaver_vedlegg_feilmelding">
                <FormattedMessage id={feilId} values={{filnavn: filnavn}} />
            </div>
        );
    } else {
        return (
            <div className="oppgaver_vedlegg_feilmelding">
                <FormattedMessage id={feilId} />
            </div>
        );
    }
};

const feilmeldingComponent = (feilId: string) => {
    return (
        <li>
            <div className="oppgaver_vedlegg_feilmelding">
                <FormattedMessage id={feilId} />
            </div>
        </li>
    );
};

function skrivFeilmelding(listeMedFil: Array<FilFeil>, id: number) {
    let filnavn = "";

    const flagg = {
        ulovligFil: false,
        ulovligFiler: false,
        legalFileExtension: false,
        containsUlovligeTegn: false,
        maxFilStorrelse: false,
    };

    listeMedFil.forEach(value => {
        if (value.oppgaveIndex === id) {
            if (value.containsUlovligeTegn || value.maxFilStorrelse || value.legalFileExtension) {
                if (listeMedFil.length === 1) {
                    filnavn = listeMedFil.length === 1 ? listeMedFil[0].filename : "";
                    flagg.ulovligFil = true;
                } else {
                    flagg.ulovligFiler = true;
                    flagg.ulovligFil = false;
                }
                if (value.maxFilStorrelse) {
                    flagg.maxFilStorrelse = true;
                }
                if (value.containsUlovligeTegn) {
                    flagg.containsUlovligeTegn = true;
                }
                if (value.legalFileExtension) {
                    flagg.legalFileExtension = true;
                }
            }
        }
    });

    return (
        <ul>
            {flagg.ulovligFil && feilmeldingComponentTittel("vedlegg.ulovlig_en_fil_feilmelding", filnavn, listeMedFil)}
            {flagg.ulovligFiler && feilmeldingComponentTittel("vedlegg.ulovlig_flere_fil_feilmelding", "", listeMedFil)}
            {flagg.containsUlovligeTegn && feilmeldingComponent("vedlegg.ulovlig_filnavn_feilmelding")}
            {flagg.legalFileExtension && feilmeldingComponent("vedlegg.ulovlig_filtype_feilmelding")}
            {flagg.maxFilStorrelse && feilmeldingComponent("vedlegg.ulovlig_filstorrelse_feilmelding")}
        </ul>
    );
}

const OppgaveView: React.FC<Props> = ({oppgave, oppgaverErFraInnsyn, oppgaveIndex}) => {
    const dispatch = useDispatch();
    const [listeMedFil, setListeMedFil] = useState<Array<FilFeil>>([]);
    const [maxMengde, setMaxMengde] = useState<boolean>(false);
    const oppgaveVedlegsOpplastingFeilet: boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.oppgaveVedlegsOpplastingFeilet
    );
    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const kanLasteOppVedlegg: boolean = erOpplastingAvVedleggEnabled(kommuneResponse);
    const opplastingFeilet = harFilerMedFeil(oppgave.oppgaveElementer);
    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(new Date(oppgave.innsendelsesfrist!!));

    const onLinkClicked = (id: number, event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
        let handleOnLinkClicked = (response: boolean) => {
            dispatch(setOppgaveVedleggopplastingFeilet(response));
        };
        if (handleOnLinkClicked) {
            handleOnLinkClicked(false);
        }
        const uploadElement: any = document.getElementById("file_" + oppgaveIndex + "_" + id);
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (event: any, oppgaveElement: OppgaveElement, oppgaveIndex: number) => {
        const files: FileList | null = event.currentTarget.files;
        let sammensattFilstorrelse = 0;
        let filerMedFeil = [];

        if (files) {
            let sjekkMaxMengde = false;
            for (let index = 0; index < files.length; index++) {
                const file: File = files[index];
                const filename = file.name;

                let fileErrorObject: FilFeil = {
                    legalFileExtension: false,
                    containsUlovligeTegn: false,
                    maxFilStorrelse: false,
                    arrayIndex: index,
                    oppgaveIndex: oppgaveIndex,
                    filename: filename,
                };

                if (!legalFileExtension(filename)) {
                    fileErrorObject.legalFileExtension = true;
                }
                if (containsUlovligeTegn(filename)) {
                    fileErrorObject.containsUlovligeTegn = true;
                }
                if (legalFileSize(file)) {
                    fileErrorObject.maxFilStorrelse = true;
                }
                if (legalCombinedFilesSize(sammensattFilstorrelse)) {
                    sjekkMaxMengde = true;
                }

                if (
                    fileErrorObject.legalFileExtension ||
                    fileErrorObject.containsUlovligeTegn ||
                    fileErrorObject.maxFilStorrelse
                ) {
                    filerMedFeil.push(fileErrorObject);
                }
                sammensattFilstorrelse += file.size;
            }
            setListeMedFil(filerMedFeil);
            setMaxMengde(sjekkMaxMengde);

            if (sjekkMaxMengde) {
                logInfoMessage(
                    "Bruker prøvde å laste opp over 350 mb. Størrelse på vedlegg var: " +
                        sammensattFilstorrelse / (1024 * 1024)
                );
            }

            if (filerMedFeil.length === 0 && !sjekkMaxMengde) {
                for (let index = 0; index < files.length; index++) {
                    const file: File = files[index];
                    dispatch({
                        type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                        oppgaveElement: oppgaveElement,
                        fil: {
                            filnavn: file.name,
                            status: "INITIALISERT",
                            file: file,
                        },
                    });
                }
            }
        }
        if (event.target.value === "") {
            return;
        }
        event.preventDefault();
    };

    function velgFil(
        typeTekst: string,
        tilleggsinfoTekst: string | undefined,
        oppgaveElement: OppgaveElement,
        id: number
    ) {
        return (
            <div className={"oppgave-detalj-overste-linje"}>
                <div className={"tekst-wrapping"}>
                    <Element>{typeTekst}</Element>
                </div>
                {tilleggsinfoTekst && (
                    <div className={"tekst-wrapping"}>
                        <Normaltekst className="luft_over_4px">{tilleggsinfoTekst}</Normaltekst>
                    </div>
                )}
                {kanLasteOppVedlegg && (
                    <div className="oppgaver_last_opp_fil">
                        <UploadFileIcon
                            className="last_opp_fil_ikon"
                            onClick={(event: any) => {
                                onLinkClicked(id, event);
                            }}
                        />
                        <Lenke
                            href="#"
                            id={"oppgave_" + id + "_last_opp_fil_knapp"}
                            className="lenke_uten_ramme"
                            onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
                                onLinkClicked(id, event);
                            }}
                        >
                            <Element>
                                <FormattedMessage id="vedlegg.velg_fil" />
                            </Element>
                        </Lenke>
                        <input
                            type="file"
                            id={"file_" + oppgaveIndex + "_" + id}
                            multiple={true}
                            onChange={(event: ChangeEvent) => onChange(event, oppgaveElement, id)}
                            style={{display: "none"}}
                        />
                    </div>
                )}
            </div>
        );
    }

    function getOppgaveDetaljer(
        typeTekst: string,
        tilleggsinfoTekst: string | undefined,
        oppgaveElement: OppgaveElement,
        id: number
    ): JSX.Element {
        const visOppgaverDetaljeFeil: boolean =
            oppgaveVedlegsOpplastingFeilet || opplastingFeilet !== undefined || listeMedFil.length > 0;
        return (
            <div key={id} className={"oppgaver_detalj" + (visOppgaverDetaljeFeil ? " oppgaver_detalj_feil" : "")}>
                {velgFil(typeTekst, tilleggsinfoTekst, oppgaveElement, id)}
                {oppgaveElement.vedlegg &&
                    oppgaveElement.vedlegg.length > 0 &&
                    oppgaveElement.vedlegg.map((vedlegg: Vedlegg, index: number) => (
                        <VedleggActionsView vedlegg={vedlegg} key={index} />
                    ))}

                {oppgaveElement.filer &&
                    oppgaveElement.filer.length > 0 &&
                    oppgaveElement.filer.map((fil: Fil, index: number) => (
                        <FilView key={index} fil={fil} oppgaveElement={oppgaveElement} index={index} />
                    ))}
                {validerFilArrayForFeil() && skrivFeilmelding(listeMedFil, id)}
            </div>
        );
    }

    function validerFilArrayForFeil() {
        return listeMedFil && listeMedFil.length ? true : false;
    }

    const visOppgaverDetaljeFeil: boolean =
        oppgaveVedlegsOpplastingFeilet || opplastingFeilet !== undefined || listeMedFil.length > 0;
    return (
        <div
            className={
                (visOppgaverDetaljeFeil ? "oppgaver_detaljer_feil_ramme" : "oppgaver_detaljer") + " luft_over_1rem"
            }
        >
            {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert <= 0 && (
                <Normaltekst className="luft_under_8px">
                    <FormattedMessage
                        id="oppgaver.innsendelsesfrist"
                        values={{innsendelsesfrist: formatDato(oppgave.innsendelsesfrist!)}}
                    />
                </Normaltekst>
            )}
            {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert > 0 && (
                <Normaltekst className="luft_under_8px">
                    <FormattedMessage
                        id="oppgaver.innsendelsesfrist_passert"
                        values={{innsendelsesfrist: formatDato(oppgave.innsendelsesfrist!)}}
                    />
                </Normaltekst>
            )}
            {oppgave.oppgaveElementer.map((oppgaveElement, index) => {
                let {typeTekst, tilleggsinfoTekst} = getVisningstekster(
                    oppgaveElement.dokumenttype,
                    oppgaveElement.tilleggsinformasjon
                );
                return getOppgaveDetaljer(typeTekst, tilleggsinfoTekst, oppgaveElement, index);
            })}
            {(oppgaveVedlegsOpplastingFeilet || opplastingFeilet) && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage
                        id={
                            oppgaveVedlegsOpplastingFeilet
                                ? "vedlegg.minst_ett_vedlegg"
                                : "vedlegg.opplasting_feilmelding"
                        }
                    />
                </div>
            )}
            {maxMengde && (
                <div className="oppgaver_vedlegg_feilmelding" style={{marginBottom: "1rem"}}>
                    <FormattedMessage id={"vedlegg.ulovlig_storrelse_av_alle_valgte_filer"} />
                </div>
            )}
        </div>
    );
};

export default OppgaveView;
