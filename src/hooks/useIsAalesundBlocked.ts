import {useHentSoknadsStatus} from "../generated/soknads-status-controller/soknads-status-controller";
import useFiksDigisosId from "./useFiksDigisosId";
import {isAfter, isBefore} from "date-fns";

const useIsAalesundBlocked = () => {
    const fiksDigisosId = useFiksDigisosId();
    const {data: soknadsStatus} = useHentSoknadsStatus(fiksDigisosId);

    const now = new Date();
    const newYear = new Date(2024, 0, 1, 0, 0, 0);

    return soknadsStatus?.kommunenummer === "1507" && isAfter(now, newYear);
};

export default useIsAalesundBlocked;
