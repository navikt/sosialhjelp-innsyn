import React, {ChangeEvent, useState} from "react"
import {Element, Normaltekst} from "nav-frontend-typografi";
import {Fil, Oppgave} from "../../redux/innsynsdata/innsynsdataReducer";
import FilView from "../oppgaver/FilView";
import UploadFileIcon from "../ikoner/UploadFile";
import Lenke from "nav-frontend-lenker";
import {FormattedMessage} from "react-intl";
import {legalFileExtension} from "../oppgaver/OppgaveView";
import {Hovedknapp} from "nav-frontend-knapper";

const AndreVedleggView: React.FC = () => {

    const [antallUlovligeFiler, setAntallUlovligeFiler] = useState(0);
    const [andreFiler, setAndreFiler] = useState<Fil[]>([]);

    // FIXME: Er ikke i redux, så vil ikke virke
    const oppgave: Oppgave = {
        innsendelsesfrist: "",
        dokumenttype: "Annet",
        tilleggsinformasjon: "",
        erFraInnsyn: true,
        vedlegg: [],
        filer: []
    };

    const onLinkClicked = (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
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
                    setAndreFiler(andreFiler.concat([
                        {filnavn: filename, file: file, status: ""}
                    ]));
                } else {
                    ulovligeFilerCount += 1;
                }
            }
            setAntallUlovligeFiler(ulovligeFilerCount);
        }
        event.target.value = null;
        event.preventDefault();
    };

    return (
        <div className="oppgaver_detaljer">

            <div className={"oppgaver_detalj " + (antallUlovligeFiler > 0 ? " oppgaver_detalj_feil" : "")}>
                <Element><FormattedMessage id="andre_vedlegg.type" /></Element>
                    <Normaltekst className="luft_over_4px">
                        <FormattedMessage id="andre_vedlegg.tilleggsinfo" />
                    </Normaltekst>

                {andreFiler && andreFiler.length > 0 && andreFiler.map((fil: Fil, index: number) =>
                    <FilView key={index} fil={fil} oppgave={oppgave}/>
                )}

                <div className="oppgaver_last_opp_fil">
                    <UploadFileIcon
                        className="last_opp_fil_ikon"
                        onClick={(event: any) => {onLinkClicked(event)}}
                    />
                    <Lenke
                        href="#"
                        className="lenke_uten_ramme"
                        onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {onLinkClicked(event)}}
                    >
                        <Element>
                            <FormattedMessage id="vedlegg.velg_fil"/>
                        </Element>
                    </Lenke>
                    <input
                        type="file"
                        id={'file_andre'}
                        multiple={true}
                        onChange={(event: ChangeEvent) => {onChange(event)}}
                        style={{display: "none"}}
                    />
                </div>
            </div>

            <Hovedknapp
                disabled={false}
                type="hoved"
                className="luft_over_2rem luft_under_1rem"
                onClick={(event: any) => console.log("send vedlegg")}
            >
            <FormattedMessage id="andre_vedlegg.send_knapp_tittel"/>

            </Hovedknapp>
        </div>
    )
};

export default AndreVedleggView;