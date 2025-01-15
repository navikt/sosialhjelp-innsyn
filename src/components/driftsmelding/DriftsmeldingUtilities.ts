import { KommuneResponse } from "../../generated/model";

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
    kommuneResponse: KommuneResponse | undefined
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
    }
    return undefined;
};
