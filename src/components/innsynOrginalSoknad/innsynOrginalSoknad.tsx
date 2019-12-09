import * as React from 'react';
import {Hovedknapp} from "nav-frontend-knapper";
import {fetchToJson} from "../../utils/restUtils";
import InnsynOrginalSoknadView from "./innsynOrginalSoknadView";
import {useState} from "react";
import {
    isOfTypeOrginalJsonSoknadResponse,
    isOfTypeOrginalSoknadPdfLinkResponse,
    isOfTypeSoknadJson, isOfTypeString
} from "./soknadTypesUtilityFunctions";
import InnsynOrgnialSoknadPdfLinkView from "./InnsynOrgnialSoknadPdfLinkView";
import {OrginalJsonSoknadResponse, OrginalSoknadPdfLinkResponse} from "./types";


interface Props {
    fiksDigisosId: string
}

interface State {
    orginalJsonSoknadResponse: OrginalJsonSoknadResponse | null;
    orginalSoknadPdfLinkResponse: OrginalSoknadPdfLinkResponse | null;
}

const initialState: State = {
    orginalJsonSoknadResponse: null,
    orginalSoknadPdfLinkResponse: null
};


const InnsynOrginalSoknad: React.FC<Props> = (props: Props) => {

    let [state, setState]: [State, (stateUpdated: State) => void] = useState(initialState);


    const getOrginalSoknad = (fiksDigisosId: string) => {

        const urlOrginalJsonSoknad = `/innsyn/${fiksDigisosId}/orginalJsonSoknad`;
        fetchToJson(urlOrginalJsonSoknad).then((response: any) => {
            if (
                isOfTypeOrginalJsonSoknadResponse(response) &&
                isOfTypeSoknadJson(response.jsonSoknad)
            ){
                setState({...state, orginalJsonSoknadResponse: response});
            }
        }).catch((reason) => {
            // FIXME: Håndter feil
            console.warn("Fail'a med reason: " + reason)
        });

        const urlOrginalSoknadPdfLink = `/innsyn/${fiksDigisosId}/orginalSoknadPdfLink`;
        fetchToJson(urlOrginalSoknadPdfLink).then((response: any) => {
            if (
                isOfTypeOrginalSoknadPdfLinkResponse(response) &&
                isOfTypeString(response.orginalSoknadPdfLink)
            ){
                setState({...state, orginalSoknadPdfLinkResponse: response});
            }
        }).catch((reason) => {
            // FIXME: Håndter feil
            console.warn("Fail'a med reason: " + reason)
        });
    };

    return (
        <div>
            <Hovedknapp onClick={() => getOrginalSoknad(props.fiksDigisosId)}>Hent orginalsøknad fra server</Hovedknapp>

            <InnsynOrginalSoknadView
                orginalJsonSoknad={state.orginalJsonSoknadResponse ? state.orginalJsonSoknadResponse.jsonSoknad : undefined}
            />

            <InnsynOrgnialSoknadPdfLinkView
                url={ state.orginalSoknadPdfLinkResponse ? state.orginalSoknadPdfLinkResponse.orginalSoknadPdfLink : undefined}
            />
        </div>
    )
};

export default InnsynOrginalSoknad;