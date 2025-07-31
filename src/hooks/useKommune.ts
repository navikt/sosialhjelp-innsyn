import { useHentKommuneInfo } from "../generated/kommune-controller/kommune-controller";
import { getDriftsmeldingFromKommune } from "../components/driftsmelding/lib/getDriftsmeldingFromKommune";

import useFiksDigisosId from "./useFiksDigisosId";

const useKommune = () => {
    const fiksDigisosId = useFiksDigisosId();
    const { data: kommune, isLoading, error } = useHentKommuneInfo(fiksDigisosId);
    const driftsmelding = getDriftsmeldingFromKommune(kommune);
    return { kommune, driftsmelding, isLoading, error };
};

export default useKommune;
