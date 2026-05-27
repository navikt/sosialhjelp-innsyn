import { useFlag } from "@featuretoggles/context";
import { useHentKommuneInfoSuspense } from "@generated/kommune-controller/kommune-controller";
import { useParams } from "next/navigation";

const AKTIVE_KOMMUNER = ["1410"];

const useNewUploadEnabled = () => {
    const toggle = useFlag("sosialhjelp.innsyn.ny_upload");
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const {
        data: { kommunenummer },
    } = useHentKommuneInfoSuspense(fiksDigisosId);

    return (toggle?.enabled && AKTIVE_KOMMUNER.includes(kommunenummer ?? "")) ?? false;
};

export default useNewUploadEnabled;
