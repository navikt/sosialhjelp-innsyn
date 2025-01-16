import { useHentSoknadsStatus } from "../../generated/soknads-status-controller/soknads-status-controller";
import { useHentKommuneInfo } from "../../generated/kommune-controller/kommune-controller";
import { KommuneResponse } from "../../generated/model";

const ettersendelseDeaktivert = ({
    erInnsendingEttersendelseDeaktivert,
    erInnsendingEttersendelseMidlertidigDeaktivert,
}: KommuneResponse) => erInnsendingEttersendelseMidlertidigDeaktivert || erInnsendingEttersendelseDeaktivert;

export const useFileUploadError = (fiksDigisosId: string) => {
    const kommune = useHentKommuneInfo(fiksDigisosId);
    const soknadStatus = useHentSoknadsStatus(fiksDigisosId);

    if (kommune.isPending || soknadStatus.isPending) return undefined;
    if (soknadStatus.data.isBroken) return "driftsmelding.vedlegg.vedleggMangler";
    if (ettersendelseDeaktivert(kommune.data)) return "driftsmelding.kanIkkeSendeVedlegg";
    return null;
};
