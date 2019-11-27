import * as React from 'react';
import {Hovedknapp} from "nav-frontend-knapper";
import {fetchToJson} from "../../utils/restUtils";
import InnsynOrginalSoknadView, {OrginalSoknadResponse} from "./innsynOrginalSoknadView";
import {useState} from "react";

const initialOrginalSoknadResponse: OrginalSoknadResponse = {
    soknadJson: null,
    soknadPdfLink: null
};

interface Props {
    fiksDigisosId: string
}

const InnsynOrginalSoknad: React.FC<Props> = (props: Props) => {

    let [orginalSoknadResponse, setOrginalSoknadResponse] = useState(initialOrginalSoknadResponse as OrginalSoknadResponse);


    const getOrginalSoknad = (fiksDigisosId: string) => {
        const urlPath = `/innsyn/${fiksDigisosId}/orginalSoknad`;
        fetchToJson(urlPath).then((response: any) => {
            setOrginalSoknadResponse(response);
        }).catch((reason) => {
            // FIXME: Håndter feil
            console.warn("Fail'a med reason: " + reason)
        });
    };

    return (
        <div>
            <Hovedknapp onClick={() => getOrginalSoknad(props.fiksDigisosId)}>Hent orginalsøknad fra server</Hovedknapp>
            <InnsynOrginalSoknadView orginalSoknadResponse={orginalSoknadResponse}/>
        </div>
    )
};

export default InnsynOrginalSoknad;