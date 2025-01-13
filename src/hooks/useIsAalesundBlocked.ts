import { useRouter } from "next/router";

import { useHentSoknadsStatus } from "../generated/soknads-status-controller/soknads-status-controller";
import { useHentAlleSaker } from "../generated/saks-oversikt-controller/saks-oversikt-controller";

const useIsAalesundBlocked = (): boolean => {
    const {
        query: { id },
    } = useRouter();

    const fiksDigisosId: string | undefined = !id || Array.isArray(id) ? undefined : id;
    const { data } = useHentAlleSaker();
    const { data: soknadsStatus } = useHentSoknadsStatus(fiksDigisosId!, { query: { enabled: !!fiksDigisosId } });

    if (!fiksDigisosId) {
        return !!data?.some((sak) => sak.kommunenummer === "1507");
    }

    return soknadsStatus?.kommunenummer === "1507";
};

export default useIsAalesundBlocked;
