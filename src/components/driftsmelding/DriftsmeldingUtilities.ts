import { KommuneResponse } from "../../generated/model";
import { useHentSoknadsStatus } from "../../generated/soknads-status-controller/soknads-status-controller";

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

export const ettersendelseErDeaktivert = (kommuneInfo: KommuneResponse | undefined) => {
    return (
        !kommuneInfo ||
        kommuneInfo.erInnsendingEttersendelseMidlertidigDeaktivert ||
        kommuneInfo.erInnsendingEttersendelseDeaktivert
    );
};

export const useFileUploadAllowed = (kommuneInfo: KommuneResponse | undefined, fiksDigisosId: string) => {
    let kanLasteOppVedlegg = true;
    let textKey = "";
    const { data } = useHentSoknadsStatus(fiksDigisosId);
    if (data && data.isBroken) {
        kanLasteOppVedlegg = false;
        textKey = "driftsmelding.vedlegg.vedleggMangler";
    } else if (ettersendelseErDeaktivert(kommuneInfo)) {
        kanLasteOppVedlegg = false;
        textKey = "driftsmelding.kanIkkeSendeVedlegg";
    }

    return { kanLasteOppVedlegg, textKey };
};
