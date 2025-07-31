import { useRouter } from "next/router";
/**
 * TODO: Delete when pages folder is removed
 * @deprecated bruk `useParams<shape>()` i app-dir
 */
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
