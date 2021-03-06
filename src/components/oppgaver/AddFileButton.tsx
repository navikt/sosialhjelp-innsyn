import React, {ChangeEvent} from "react";
import {Flatknapp} from "nav-frontend-knapper";
import UploadFileIcon from "../ikoner/UploadFile";
import {Element} from "nav-frontend-typografi";
import {FormattedMessage} from "react-intl";

const AddFileButton: React.FC<{
    onChange: (event: any, dokumentasjonkravReferanse: string) => void;
    referanse: string;
    id: string;
}> = ({onChange, referanse, id}) => {
    const onClick = (event?: any): void => {
        const uploadElement: any = document.getElementById("file_" + id);
        uploadElement.click();
        if (event) {
            event.preventDefault();
        }
    };

    return (
        <div className="oppgaver_last_opp_fil">
            <Flatknapp
                mini
                id={"oppgave_" + id + "_last_opp_fil_knapp"}
                onClick={(event) => {
                    onClick(event);
                }}
            >
                <UploadFileIcon className="last_opp_fil_ikon" />
                <Element>
                    <FormattedMessage id="vedlegg.velg_fil" />
                </Element>
            </Flatknapp>
            <input
                type="file"
                id={"file_" + id}
                multiple={true}
                onChange={(event: ChangeEvent) => onChange(event, referanse)}
                style={{display: "none"}}
            />
        </div>
    );
};

export default AddFileButton;
