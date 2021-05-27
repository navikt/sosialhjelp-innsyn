import React, {ChangeEvent} from "react";
import {
    DokumentasjonEtterspurtElement,
    DokumentasjonKravElement,
    InnsynsdataSti,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {FileError} from "../../utils/vedleggUtils";
import {Flatknapp} from "nav-frontend-knapper";
import UploadFileIcon from "../ikoner/UploadFile";
import {Element} from "nav-frontend-typografi";
import {FormattedMessage} from "react-intl";
import {v4 as uuidv4} from "uuid";

const AddFileButton: React.FC<{
    onClick: (uuid: string, event?: any) => void;
    onChange: (event: any) => void;
}> = ({onClick, onChange}) => {
    const uuid = uuidv4();

    return (
        <div className="oppgaver_last_opp_fil">
            <Flatknapp
                mini
                id={"oppgave_" + uuid + "_last_opp_fil_knapp"}
                onClick={(event) => {
                    onClick(uuid, event);
                }}
            >
                <UploadFileIcon className="last_opp_fil_ikon" />
                <Element>
                    <FormattedMessage id="vedlegg.velg_fil" />
                </Element>
            </Flatknapp>
            <input
                type="file"
                id={"file_" + uuid}
                multiple={true}
                onChange={(event: ChangeEvent) => onChange(event)}
                style={{display: "none"}}
            />
        </div>
    );
};

export default AddFileButton;
