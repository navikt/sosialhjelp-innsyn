import {useParams} from "react-router-dom";
import {useHentKommuneInfo} from "../generated/kommune-controller/kommune-controller";

const useKommune = () => {
    const {soknadId} = useParams<{soknadId: string}>();
    if (!soknadId) {
        throw Error("Kunne ikke finne søknadId i parametere");
    }
    const {data, isLoading, error} = useHentKommuneInfo(soknadId);
    return {kommune: data, isLoading, error};
};

export default useKommune;
