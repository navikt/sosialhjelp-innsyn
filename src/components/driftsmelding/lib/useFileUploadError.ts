import { useHentSoknadsStatus } from "@generated/soknads-status-controller/soknads-status-controller";
import { useHentKommuneInfo } from "@generated/kommune-controller/kommune-controller";
import { KommuneResponse } from "@generated/model";

import useFiksDigisosId from "../../../hooks/useFiksDigisosId";

const ettersendelseDeaktivert = ({
    erInnsendingEttersendelseDeaktivert,
    erInnsendingEttersendelseMidlertidigDeaktivert,
}: KommuneResponse) => erInnsendingEttersendelseMidlertidigDeaktivert || erInnsendingEttersendelseDeaktivert;

/**
 * Utleder feilstatus for filopplasting, basert på kommunal driftstatus
 * fra FIKS Digisos.
 *
 * @returns
 *    "driftsmelding.kanIkkeSendeVedlegg"
 *      dersom fiks digisos kommuneinfo sier at ettersendelse er deaktivert.
 *    undefined
 *      mens vi laster kommune- og søknadsinfo
 *    null
 *      om alt er OK.
 */
export const useFileUploadError = () => {
    const fiksDigisosId = useFiksDigisosId();
    const { data: kommuneInfo } = useHentKommuneInfo(fiksDigisosId);
    const { data: soknadStatus } = useHentSoknadsStatus(fiksDigisosId);

    if (!kommuneInfo || !soknadStatus) return undefined;
    if (ettersendelseDeaktivert(kommuneInfo)) return "driftsmelding.kanIkkeSendeVedlegg";
    return null;
};
