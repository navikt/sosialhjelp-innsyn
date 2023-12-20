import {useHentSoknadsStatus} from "../generated/soknads-status-controller/soknads-status-controller";
import {isAfter} from "date-fns";
import {useRouter} from "next/router";
import {useHentAlleSaker} from "../generated/saks-oversikt-controller/saks-oversikt-controller";

const newYear = new Date(2024, 0, 1, 0, 0, 0);

const useIsAalesundBlocked = (): {showBanner: boolean; disableUpload: boolean | undefined} => {
    const {
        query: {id},
    } = useRouter();

    const fiksDigisosId: string | undefined = !id || Array.isArray(id) ? undefined : id;
    const {data} = useHentAlleSaker();
    const {data: soknadsStatus} = useHentSoknadsStatus(fiksDigisosId!, {query: {enabled: !!fiksDigisosId}});

    if (!fiksDigisosId) {
        return {
            showBanner: !!data?.some((sak) => sak.kommunenummer === "1507"),
            disableUpload: undefined,
        };
    }

    const now = new Date();
    const isAalesund = soknadsStatus?.kommunenummer === "1507";
    const isAfterNewYears = isAfter(now, newYear);
    return {
        showBanner: isAalesund,
        disableUpload: isAfterNewYears && isAalesund,
    };
};

export default useIsAalesundBlocked;
