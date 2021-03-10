import {DokumentasjonEtterspurt, SaksStatusState} from "../../redux/innsynsdata/innsynsdataReducer";
import {getSkalViseVilkarView} from "../vilkar/VilkarUtils";

export const getSkalViseIngenOppgaverPanel = (
    oppgaver: undefined | string | DokumentasjonEtterspurt[],
    innsynSaksStatusListe: undefined | SaksStatusState[]
) => {
    return brukerHarIngenOppgaver(oppgaver) && vilkarViewVisesIkke(innsynSaksStatusListe);
};

const brukerHarIngenOppgaver = (oppgaver: undefined | string | DokumentasjonEtterspurt[]): boolean => {
    if (oppgaver && Array.isArray(oppgaver) && oppgaver.length > 0) {
        return false;
    }
    return true;
};

export const vilkarViewVisesIkke = (innsynSaksStatusListe: undefined | SaksStatusState[]): boolean => {
    return !getSkalViseVilkarView(innsynSaksStatusListe);
};
