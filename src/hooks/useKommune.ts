import {useHentKommuneInfo} from "../generated/kommune-controller/kommune-controller";
import useFiksDigisosId from "./useFiksDigisosId";

const useKommune = () => {
    const fiksDigisosId = useFiksDigisosId();
    const {data, isLoading, error} = useHentKommuneInfo(fiksDigisosId);
    return {kommune: data, isLoading, error};
};

export default useKommune;
