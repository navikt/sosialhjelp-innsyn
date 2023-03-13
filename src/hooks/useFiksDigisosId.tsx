import {useParams} from "react-router-dom";

const useFiksDigososId = () => {
    const {soknadId} = useParams<{soknadId: string}>();
    if (!soknadId) {
        throw Error("Kunne ikke finne søknadId i parametere");
    }
    return soknadId;
};

export default useFiksDigososId;
