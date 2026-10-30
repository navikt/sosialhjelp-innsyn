import { kanSendeKlage } from "@generated/ssr/klage-controller/klage-controller";

export const isKlageTilgjengelig = async (fiksDigisosId: string): Promise<boolean> => {
    try {
        const response = await kanSendeKlage(fiksDigisosId);
        return response.kanSendeKlage;
    } catch {
        return false;
    }
};
