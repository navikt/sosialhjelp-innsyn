import { InnsendtSoknad } from "@components/soknaderList/list/soknaderUtils";

const useIkkeInnsyn = (soknad: InnsendtSoknad) =>
    soknad.status === "BEHANDLES_IKKE" ||
    (soknad.saker.length > 0 &&
        soknad.saker.every((sak) => sak.status === "IKKE_INNSYN" || sak.status === "BEHANDLES_IKKE"));

export default useIkkeInnsyn;
