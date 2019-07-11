import React from "react";
import "./filespike.less";
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
// import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
// @ts-ignore
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import {Oppgave} from "../../redux/innsynsdata/innsynsdataReducer";


registerPlugin( FilePondPluginImagePreview);
// registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

interface Props {
    oppgave: Oppgave;
}

const FileSpike: React.FC<Props> = ({oppgave}) => {

    // const [files] = useState([]);


    return (
        <div className="filespike">
            <FilePond
                // files={files}
                allowMultiple={true}
                // onupdatefiles={setFiles}

                // labelIdle='
                //     <div className="oppgaver_detalj">
                //         <p className="typo-element">Strømfaktura</p><p className="typo-normal luft_over_4px">For periode 01.01.2019 til 01.02.2019</p><div className="skjemaelement skjemaelement--horisontal luft_over_1rem"><input type="checkbox" className="skjemaelement__input checkboks" id="16788944-9334-25357-01320-1860124189466"><label className="skjemaelement__label" htmlFor="16788944-9334-25357-01320-1860124189466">Dette har jeg levert</label><div role="alert" aria-live="assertive"></div></div><div className="oppgaver_last_opp_fil"><span><svg className="last_opp_fil_ikon" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"><path d="M23 19v2c0 1.656-1.285 3-2.869 3H3.869C2.284 24 1 22.656 1 21v-2M12 1v17M5 8l7-7 7 7" fill="none" fill-rule="evenodd" stroke="#0067C5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span><a href="/todo" className="lenke"><p className="typo-element filepond--label-action">Last opp vedlegg</p></a></div>
                //         </div>
                //
                //     Slipp vedlegg her, eller <span class="filepond--label-action">Bla i filer</span>
                //     '
                //

                labelIdle='
                      <div className="oppgaver_last_opp_fil"><span><svg style="float: left;height: 20px;stroke-width: 2px;" className="last_opp_fil_ikon" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25"><path d="M23 19v2c0 1.656-1.285 3-2.869 3H3.869C2.284 24 1 22.656 1 21v-2M12 1v17M5 8l7-7 7 7" fill="none" fill-rule="evenodd" stroke="#0067C5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span><span className="typo-element filepond--label-action" style="margin-left: 8px;color: #0067C5;text-decoration: none;font-weight: 600;cursor: pointer;"> Last opp vedlegg</span></div>'

            />
        </div>
    )
};

export default FileSpike;
