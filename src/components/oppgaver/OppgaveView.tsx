import React, {useState} from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import UploadFileIcon from "../ikoner/UploadFile";
import {Fil, InnsynsdataActionTypeKeys, Oppgave, Vedlegg} from "../../redux/innsynsdata/innsynsdataReducer";
import VedleggActionsView from "./VedleggActionsView";
import FilView from "./FilView";
import {useDispatch} from "react-redux";
import {OriginalSoknadVedleggType} from "../../redux/soknadsdata/vedleggTypes";
import {originalSoknadVedleggTekstVisning} from "../../redux/soknadsdata/vedleggskravVisningConfig";
import {FormattedMessage} from "react-intl";

interface Props {
    className?: string;
    oppgave: Oppgave;
    id: any;
    handleOnLinkClicked?: (value: boolean) => void;
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

const OppgaveView: React.FC<Props> = ({className, oppgave, id, handleOnLinkClicked}: Props) => {

    const dispatch = useDispatch();
    const [antallUlovligeFiler, setAntallUlovligeFiler] = useState(0);

    const onLinkClicked = (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {

        if (handleOnLinkClicked) {
            handleOnLinkClicked(false);
        }
        const uploadElement: any = document.getElementById('file_' + id);
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    const onChange = (event: any) => {
        const files: FileList | null = event.currentTarget.files;
        if (files) {
            let ulovligeFilerCount = 0;
            for (var index = 0; index < files.length; index++) {
                const file: File = files[index];
                const filename = file.name;
                if (legalFileExtension(filename)) {
                    dispatch({
                        type: InnsynsdataActionTypeKeys.LEGG_TIL_FIL_FOR_OPPLASTING,
                        oppgave: oppgave,
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

    let {typeTekst, tilleggsinfoTekst} = getVisningstekster(oppgave.dokumenttype, oppgave.tilleggsinformasjon);

    return (
        <>
            <div className={"oppgaver_detalj " + className}>
                <Element>{typeTekst}</Element>
                {tilleggsinfoTekst && (
                    <Normaltekst className="luft_over_4px">
                        {tilleggsinfoTekst}
                    </Normaltekst>)}

                {oppgave.vedlegg && oppgave.vedlegg.length > 0 && oppgave.vedlegg.map((vedlegg: Vedlegg, index: number) =>
                    <VedleggActionsView vedlegg={vedlegg} key={index}/>
                )}

                {oppgave.filer && oppgave.filer.length > 0 && oppgave.filer.map((fil: Fil, index: number) =>
                    <FilView key={index} fil={fil} oppgave={oppgave} index={index}/>
                )}

                <div className="oppgaver_last_opp_fil">
                    <UploadFileIcon
                        className="last_opp_fil_ikon"
                        onClick={(event: any) => {
                            onLinkClicked(event)
                        }}
                    />
                    <Lenke
                        href="#"
                        id={"oppgave_" + id + "_last_opp_fil_knapp"}
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
                        id={'file_' + id}
                        multiple={true}
                        onChange={(event: ChangeEvent) => onChange(event)}
                        style={{display: "none"}}
                    />
                </div>

            </div>

            {antallUlovligeFiler > 0 && (
                <div className="oppgaver_vedlegg_feilmelding">
                    <FormattedMessage id="vedlegg.lovlig_filtype_feilmelding"/>
                </div>
            )}

        </>
    )
};

export default OppgaveView;
