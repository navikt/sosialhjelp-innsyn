import {SaksStatus, SaksStatusState, UtfallVedtak, Vedtak} from "../../redux/innsynsdata/innsynsdataReducer";

export const getSkalViseVilkarView = (innsynSaksStatusStateListe: SaksStatusState[]): boolean => {
    if (innsynSaksStatusStateListe && Array.isArray(innsynSaksStatusStateListe)) {
        let ferdigBehandledeSaker: SaksStatusState[] = innsynSaksStatusStateListe.filter((s: SaksStatusState) => {
            return s.status === SaksStatus.FERDIGBEHANDLET
        });
        let saksStatusStateListeMedInnvilgetEllerDelvisInnvilgetVedtak: SaksStatusState[] = ferdigBehandledeSaker.filter((ferdigBehandledeSak: SaksStatusState) => {
            let sisteVedtakMedUtfallErInnvilgetEllerDelvisInnvilget = false;
            ferdigBehandledeSak.vedtaksListe.forEach((vedtak: Vedtak) => {
                if (vedtak.utfall && (vedtak.utfall === UtfallVedtak.DELVIS_INNVILGET || vedtak.utfall === UtfallVedtak.INNVILGET)){
                    sisteVedtakMedUtfallErInnvilgetEllerDelvisInnvilget = true;
                } else if ( vedtak.utfall && (vedtak.utfall === UtfallVedtak.AVVIST || vedtak.utfall === UtfallVedtak.AVSLATT)){
                    sisteVedtakMedUtfallErInnvilgetEllerDelvisInnvilget = false;
                }
            });
            return sisteVedtakMedUtfallErInnvilgetEllerDelvisInnvilget;
        });
        if (saksStatusStateListeMedInnvilgetEllerDelvisInnvilgetVedtak.length > 0) {
            return true;
        }
    }
    return false;
};
