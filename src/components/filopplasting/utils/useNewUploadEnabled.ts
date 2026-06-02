import { useFlag } from "@featuretoggles/context";
import { useHentKommuneInfoSuspense } from "@generated/kommune-controller/kommune-controller";
import { useParams } from "next/navigation";
import { browserEnv } from "@config/env";

// Lillestrøm kommune
const INNRULLERTE_KOMMUNER: string[] = ["3205", "0301", "4204"];

const useNewUploadEnabled = () => {
    const toggle = useFlag("sosialhjelp.innsyn.ny_upload");
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const {
        data: { kommunenummer },
    } = useHentKommuneInfoSuspense(fiksDigisosId);

    if (!toggle?.enabled) return false;
    if (browserEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT !== "prod") return true;
    return INNRULLERTE_KOMMUNER.includes(kommunenummer ?? "");
};

export default useNewUploadEnabled;
