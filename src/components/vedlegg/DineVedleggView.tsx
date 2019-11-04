import React, {ChangeEvent, useState} from "react"
import {Element, Normaltekst} from "nav-frontend-typografi";
import {Fil, InnsynsdataActionTypeKeys, InnsynsdataSti} from "../../redux/innsynsdata/innsynsdataReducer";
import FilView from "../oppgaver/FilView";
import UploadFileIcon from "../ikoner/UploadFile";
import Lenke from "nav-frontend-lenker";
import {FormattedMessage} from "react-intl";
import {legalFileExtension} from "../oppgaver/OppgaveView";
import {Hovedknapp} from "nav-frontend-knapper";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {hentInnsynsdata, innsynsdataUrl} from "../../redux/innsynsdata/innsynsDataActions";
import {fetchPost} from "../../utils/restUtils";

function opprettFormDataMedVedlegg(filer: Fil[]): FormData {
    let formData = new FormData();
    const metadataJson = genererMetatadataJson(filer);
    const metadataBlob = new Blob([metadataJson], {type: 'application/json'});
    formData.append("files", metadataBlob, "metadata.json");
    filer.map((fil: Fil) => {
        return formData.append("files", fil.file, fil.filnavn);
    });
    return formData;
}

function genererMetatadataJson(filer: Fil[]) {
    let metadata: any[] = [];
    let filnavnArr = filer.map((fil: any) => {
        return {filnavn: fil.filnavn}
    });
    metadata.push({
        type: "FIXME",
        tilleggsinfo: "FIXME",
        filer: filnavnArr
    });
    return JSON.stringify(metadata, null, 8);
}

const DineVedleggView: React.FC = () => {

    const dispatch = useDispatch();
    const fiksDigisosId: string | undefined = useSelector((state: InnsynAppState) => state.innsynsdata.fiksDigisosId);
    const [antallUlovligeFiler, setAntallUlovligeFiler] = useState(0);
    const andreFiler: Fil[] = useSelector((state: InnsynAppState) => state.innsynsdata.filer);
    const vedleggKlarForOpplasting = andreFiler.length > 0;

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
                    dispatch({
                        type: InnsynsdataActionTypeKeys.LEGG_TIL_ANNEN_FIL_FOR_OPPLASTING,
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

        let formData = opprettFormDataMedVedlegg(andreFiler);
        const sti: InnsynsdataSti = InnsynsdataSti.SEND_VEDLEGG;
        const path = innsynsdataUrl(fiksDigisosId, sti);

        fetchPost(path, formData, "multipart/form-data").then((filRespons: any) => {
            let harFeil: boolean = false;
            if (Array.isArray(filRespons)) {
                for (let index = 0; index < filRespons.length; index++) {
                    const fileItem = filRespons[index];
                    if (fileItem.status !== "OK") {
                        harFeil = true;
                    }
                    dispatch({
                        type: InnsynsdataActionTypeKeys.SETT_STATUS_FOR_ANNEN_FIL,
                        filnavn: fileItem.filnavn,
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

    return (
        <div className="oppgaver_detaljer">
            <div className={"oppgaver_detalj " + (antallUlovligeFiler > 0 ? " oppgaver_detalj_feil" : "")}>
                <Element><FormattedMessage id="andre_vedlegg.type" /></Element>
                    <Normaltekst className="luft_over_4px">
                        <FormattedMessage id="andre_vedlegg.tilleggsinfo" />
                    </Normaltekst>

                {andreFiler && andreFiler.length > 0 && andreFiler.map((fil: Fil, index: number) =>
                    <FilView key={index} fil={fil}/>
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

            {antallUlovligeFiler > 0 && (
                <div className="oppgaver_vedlegg_feilmelding">
                    <FormattedMessage id="vedlegg.lovlig_filtype_feilmelding"/>
                </div>
            )}

            <Hovedknapp
                disabled={!vedleggKlarForOpplasting}
                type="hoved"
                className="luft_over_2rem luft_under_1rem"
                onClick={(event: any) => sendVedlegg(event)}
            >
            <FormattedMessage id="andre_vedlegg.send_knapp_tittel"/>

            </Hovedknapp>
        </div>
    )
};

export default DineVedleggView;