import { useHentSoknadsStatus } from "../../generated/soknads-status-controller/soknads-status-controller";
import { useHentKommuneInfo } from "../../generated/kommune-controller/kommune-controller";
import { KommuneResponse } from "../../generated/model";

const ettersendelseDeaktivert = ({
    erInnsendingEttersendelseDeaktivert,
    erInnsendingEttersendelseMidlertidigDeaktivert,
}: KommuneResponse) => erInnsendingEttersendelseMidlertidigDeaktivert || erInnsendingEttersendelseDeaktivert;

export const useFileUploadError = (fiksDigisosId: string) => {
    const { data: kommuneInfo } = useHentKommuneInfo(fiksDigisosId);
    const { data: soknadStatus } = useHentSoknadsStatus(fiksDigisosId);

    if (!kommuneInfo || !soknadStatus) return undefined;
    if (soknadStatus?.isBroken) return "driftsmelding.vedlegg.vedleggMangler";
    if (ettersendelseDeaktivert(kommuneInfo)) return "driftsmelding.kanIkkeSendeVedlegg";
    return null;
};
