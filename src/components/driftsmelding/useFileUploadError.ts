import { useHentSoknadsStatus } from "../../generated/soknads-status-controller/soknads-status-controller";
import { useHentKommuneInfo } from "../../generated/kommune-controller/kommune-controller";
import { KommuneResponse } from "../../generated/model";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";

const ettersendelseDeaktivert = ({
    erInnsendingEttersendelseDeaktivert,
    erInnsendingEttersendelseMidlertidigDeaktivert,
}: KommuneResponse) => erInnsendingEttersendelseMidlertidigDeaktivert || erInnsendingEttersendelseDeaktivert;

/**
 * Utleder feilstatus for filopplasting, basert på kommunal driftstatus
 * fra FIKS Digisos, og hvorvidt isBroken-flagget er satt på soknadsstatus.
 *
 * @returns
 *    "driftsmelding.kanIkkeSendeVedlegg"
 *      dersom fiks digisos kommuneinfo sier at ettersendelse er deaktivert.
 *    "driftsmelding.vedlegg.vedleggMangler"
 *      dersom isBroken-flagget er satt på aktiv søknad.
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
    if (soknadStatus?.isBroken) return "driftsmelding.vedlegg.vedleggMangler";
    if (ettersendelseDeaktivert(kommuneInfo)) return "driftsmelding.kanIkkeSendeVedlegg";
    return null;
};
