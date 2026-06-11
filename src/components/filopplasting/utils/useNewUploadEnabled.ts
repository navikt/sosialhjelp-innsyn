import { useFlag } from "@featuretoggles/context";

const useNewUploadEnabled = () => {
    const toggle = useFlag("sosialhjelp.innsyn.ny_upload");

    return toggle.enabled;
};

export default useNewUploadEnabled;
