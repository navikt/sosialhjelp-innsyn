import { KommuneResponse } from "../../generated/model";
import { useHentSoknadsStatus } from "../../generated/soknads-status-controller/soknads-status-controller";

export const ettersendelseErDeaktivert = (kommuneInfo: KommuneResponse | undefined) => {
    return (
        !kommuneInfo ||
        kommuneInfo.erInnsendingEttersendelseMidlertidigDeaktivert ||
        kommuneInfo.erInnsendingEttersendelseDeaktivert
    );
};

export const useFileUploadError = (kommuneInfo: KommuneResponse | undefined, fiksDigisosId: string) => {
    let textKey = null;
    const { data } = useHentSoknadsStatus(fiksDigisosId);
    if (data?.isBroken) {
        textKey = "driftsmelding.vedlegg.vedleggMangler";
    } else if (ettersendelseErDeaktivert(kommuneInfo)) {
        textKey = "driftsmelding.kanIkkeSendeVedlegg";
    }

    return { textKey };
};
