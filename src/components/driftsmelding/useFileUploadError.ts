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
    const { data } = useHentSoknadsStatus(fiksDigisosId);
    if (!data) return undefined;
    else if (data.isBroken) return "driftsmelding.vedlegg.vedleggMangler";
    else if (ettersendelseErDeaktivert(kommuneInfo)) return "driftsmelding.kanIkkeSendeVedlegg";
    return null;
};
