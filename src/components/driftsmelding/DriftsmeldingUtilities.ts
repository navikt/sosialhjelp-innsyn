import {KommuneResponse} from "../../../generated/model";
import {listeOverFeiledeIder} from "./StoppedeFiksDigisosIder";

export interface Driftsmelding {
    type: DriftsmeldingType;
    textKey: string;
}

export type DriftsmeldingType =
    | "InnsynDeaktivert"
    | "EttersendelseDeaktivert"
    | "InnsynOgEttersendelseDeaktivert"
    | "FeiledeDigisosIder";

export const getDriftsmeldingByKommuneResponseOrDigisosId = (
    kommuneResponse: KommuneResponse | undefined,
    fiksDigisosId?: string | undefined
): Driftsmelding | undefined => {
    if (kommuneResponse) {
        if (
            kommuneResponse.erInnsynMidlertidigDeaktivert &&
            (kommuneResponse.erInnsendingEttersendelseDeaktivert ||
                kommuneResponse.erInnsendingEttersendelseMidlertidigDeaktivert)
        ) {
            return {
                type: "InnsynOgEttersendelseDeaktivert",
                textKey: "driftsmelding.innsynOgEttersendelseDeaktivert",
            };
        }
        if (kommuneResponse.erInnsynMidlertidigDeaktivert) {
            return {
                type: "InnsynDeaktivert",
                textKey: "driftsmelding.innsynDeaktivert",
            };
        }
        if (
            kommuneResponse.erInnsendingEttersendelseDeaktivert ||
            kommuneResponse.erInnsendingEttersendelseMidlertidigDeaktivert
        ) {
            return {
                type: "EttersendelseDeaktivert",
                textKey: "driftsmelding.ettersendelseDeaktivert",
            };
        }
        if (fiksDigisosId && listeOverFeiledeIder.includes(fiksDigisosId)) {
            return {
                type: "FeiledeDigisosIder",
                textKey: "driftsmelding.feiledeDigisosIder",
            };
        }
    }
    return undefined;
};

export const digisosIdHasFailed = (fiksDigisosId?: string | undefined) => {
    return fiksDigisosId && listeOverFeiledeIder.includes(fiksDigisosId);
};

export const ettersendelseErDeaktivert = (kommuneInfo: KommuneResponse | undefined) => {
    return (
        !kommuneInfo ||
        kommuneInfo.erInnsendingEttersendelseMidlertidigDeaktivert ||
        kommuneInfo.erInnsendingEttersendelseDeaktivert
    );
};

export const useFileUploadAllowed = (kommuneInfo: KommuneResponse | undefined, fiksDigisosId?: string | undefined) => {
    let kanLasteOppVedlegg = true;
    let textKey = "";
    if (digisosIdHasFailed(fiksDigisosId)) {
        kanLasteOppVedlegg = false;
        textKey = "driftsmelding.vedlegg.feiledeDigisosIder";
    } else if (ettersendelseErDeaktivert(kommuneInfo)) {
        kanLasteOppVedlegg = false;
        textKey = "driftsmelding.kanIkkeSendeVedlegg";
    }

    return {kanLasteOppVedlegg, textKey};
};
