import { SaksStatusResponse } from "../../../generated/model";

export const harSakMedInnvilgetEllerDelvisInnvilget = (
    innsynSaksStatusStateListe: SaksStatusResponse[] | undefined
): boolean => {
    return (
        !!innsynSaksStatusStateListe &&
        innsynSaksStatusStateListe.filter((saksStatusState) => saksStatusState.skalViseVedtakInfoPanel).length > 0
    );
};
