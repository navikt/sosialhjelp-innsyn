import {JSONFormatertSoknadOmSosialhjelpOsv} from "./soknadTypesGenerated";
import {OrginalJsonSoknadResponse, OrginalSoknadPdfLinkResponse} from "./types";

export const isOfTypeOrginalJsonSoknadResponse = (input: any): input is OrginalJsonSoknadResponse => {
    return (
        (input as OrginalJsonSoknadResponse).jsonSoknad !== undefined
    )
};

export const isOfTypeSoknadJson = (input: any): input is JSONFormatertSoknadOmSosialhjelpOsv => {
    return (
        (input as JSONFormatertSoknadOmSosialhjelpOsv).version !== undefined &&
        (input as JSONFormatertSoknadOmSosialhjelpOsv).data !== undefined &&
        (input as JSONFormatertSoknadOmSosialhjelpOsv).mottaker !== undefined
    );
};

export const isOfTypeOrginalSoknadPdfLinkResponse = (input: any): input is OrginalSoknadPdfLinkResponse => {
    return (
        (input as OrginalSoknadPdfLinkResponse).orginalSoknadPdfLink !== undefined
    )
};

export const isOfTypeString = (input: any): input is string => {
    return (
        input &&
        typeof input === 'string'
    )
};
