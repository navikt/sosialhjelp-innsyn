import * as React from 'react';
import ModalWrapper from "nav-frontend-modal";
import {Hovedknapp} from "nav-frontend-knapper";
import {useState} from "react";
import {JSONFormatertSoknadOmSosialhjelpOsv} from "./soknadTypesGenerated";


interface Props {
    orginalJsonSoknad?: JSONFormatertSoknadOmSosialhjelpOsv
}

const InnsynOrginalSoknadView: React.FC<Props> = (props: Props) => {

    const [isVisible, setIsVisible] = useState(false);
    const {orginalJsonSoknad} = props;

    if (orginalJsonSoknad){
        const {data} = orginalJsonSoknad;

        return (
            <div>
                <Hovedknapp onClick={() => setIsVisible(!isVisible)}>Toggle Modal med Orginal Søknad</Hovedknapp>
                <ModalWrapper
                    isOpen={isVisible}
                    contentLabel={"Innsyn i innsendt søknad"}
                    onRequestClose={() => setIsVisible(false)}
                >
                    <div>
                        { data.arbeid.forhold }
                    </div>

                </ModalWrapper>
            </div>
        )
    }
    return null;
};

export default InnsynOrginalSoknadView;