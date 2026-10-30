import { useKanSendeKlage } from "@generated/klage-controller/klage-controller";

const useKlageEnabled = (fiksDigisosId: string) => {
    const { data } = useKanSendeKlage(fiksDigisosId, { query: { retry: false } });

    return data?.kanSendeKlage === true;
};

export default useKlageEnabled;
