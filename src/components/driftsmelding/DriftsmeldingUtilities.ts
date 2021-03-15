import {KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";

export enum DriftsmeldingTypeKeys {
    DRIFTSMELDING_INGEN = "DRIFTSMELDING_INGEN",
    DRIFTSMELDING_INNSYN_DEAKTIVERT = "DRIFTSMELDING_INNSYN_DEAKTIVERT",
    DRIFTSMELDING_ETTERSENDELSE_DEAKTIVERT = "DRIFTSMELDING_ETTERSENDELSE_DEAKTIVERT",
    DRIFTSMELDING_INNSYN_OG_ETTERSENDELSE_DEAKTIVERT = "DRIFTSMELDING_INNSYN_OG_ETTERSENDELSE_DEAKTIVERT",
}

export interface DriftsmeldingIngen {
    type: DriftsmeldingTypeKeys.DRIFTSMELDING_INGEN;
}

export interface DriftsmeldingInnsynDeaktivert {
    type: DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_DEAKTIVERT;
    textKey: string;
}

export interface DriftsmeldingEttersendelseDeaktivert {
    type: DriftsmeldingTypeKeys.DRIFTSMELDING_ETTERSENDELSE_DEAKTIVERT;
    textKey: string;
}

export interface DriftsmeldingInnsynOgEttersendelseDeaktivert {
    type: DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_OG_ETTERSENDELSE_DEAKTIVERT;
    textKey: string;
}

export type Driftsmelding =
    | DriftsmeldingIngen
    | DriftsmeldingInnsynDeaktivert
    | DriftsmeldingEttersendelseDeaktivert
    | DriftsmeldingInnsynOgEttersendelseDeaktivert;

export const getDriftsmeldingByKommuneResponse = (kommuneResponse: KommuneResponse | undefined) => {
    if (kommuneResponse) {
        if (
            kommuneResponse.erInnsynMidlertidigDeaktivert &&
            (kommuneResponse.erInnsendingEttersendelseDeaktivert ||
                kommuneResponse.erInnsendingEttersendelseMidlertidigDeaktivert)
        ) {
            return {
                type: DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_OG_ETTERSENDELSE_DEAKTIVERT,
                textKey: "driftsmelding.innsynOgEttersendelseDeaktivert",
            } as Driftsmelding;
        }
        if (kommuneResponse.erInnsynMidlertidigDeaktivert) {
            return {
                type: DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_DEAKTIVERT,
                textKey: "driftsmelding.innsynDeaktivert",
            } as Driftsmelding;
        }
        if (
            kommuneResponse.erInnsendingEttersendelseDeaktivert ||
            kommuneResponse.erInnsendingEttersendelseMidlertidigDeaktivert
        ) {
            return {
                type: DriftsmeldingTypeKeys.DRIFTSMELDING_ETTERSENDELSE_DEAKTIVERT,
                textKey: "driftsmelding.ettersendelseDeaktivert",
            } as Driftsmelding;
        }
    }
    return {
        type: DriftsmeldingTypeKeys.DRIFTSMELDING_INGEN,
    } as Driftsmelding;
};

export const isFileUploadAllowed = (kommuneInfo: KommuneResponse | undefined): boolean => {
    if (kommuneInfo) {
        if (kommuneInfo.erInnsendingEttersendelseMidlertidigDeaktivert) {
            return false;
        }
        if (kommuneInfo.erInnsendingEttersendelseDeaktivert) {
            return false;
        }
        return true;
    }
    return false;
};
