import * as React from 'react';
import ModalWrapper from "nav-frontend-modal";
import {Hovedknapp} from "nav-frontend-knapper";
import {useState} from "react";

type JsonSoknad = any;

export interface OrginalSoknadResponse {
    soknadJson: JsonSoknad | null;
    soknadPdfLink: String | null;
}

interface Props {
    orginalSoknadResponse: OrginalSoknadResponse
}


const InnsynOrginalSoknadView: React.FC<Props> = (props: Props) => {

    const [isVisible, setIsVisible] = useState(false);

    const getSoknadPdfLinkView = () => {
        if (props.orginalSoknadResponse.soknadPdfLink) {
            return "Her er linken til pdfen"
        }
        return "Jeg vet ikke om noen link."
    };

    const soknadPdfLinkView = (
        <div>
            {getSoknadPdfLinkView()}
        </div>
    )

    return (
        <div>
            <Hovedknapp onClick={() => setIsVisible(!isVisible)}>Toggle Modal med Orginal Søknad</Hovedknapp>
            <ModalWrapper
                isOpen={isVisible}
                contentLabel={"Innsyn i innsendt søknad"}
                onRequestClose={() => setIsVisible(false)}
            >
                <div>
                    {soknadPdfLinkView}
                    <br/>
                    {props.orginalSoknadResponse.soknadJson && (
                        <div>
                            {JSON.stringify(props.orginalSoknadResponse.soknadJson, null, 4)}
                        </div>
                    )}
                    {
                        props.orginalSoknadResponse.soknadJson === null &&
                        props.orginalSoknadResponse.soknadPdfLink === null && (
                            <div>
                                Ingen data om orginalsøknaden er tilgjengelig.
                            </div>
                        )
                    }
                </div>
            </ModalWrapper>
        </div>
    )
};

export default InnsynOrginalSoknadView;