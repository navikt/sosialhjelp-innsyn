import { useRouter } from "next/router";

const useFiksDigisosId = () => {
    const {
        query: { id },
    } = useRouter();

    if (!id || Array.isArray(id)) {
        throw Error("Kunne ikke finne søknadId i parametere");
    }
    return id;
};

export default useFiksDigisosId;
