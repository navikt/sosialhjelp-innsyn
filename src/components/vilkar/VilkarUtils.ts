import {DokumentasjonKrav, SaksStatusState, Vilkar} from "../../redux/innsynsdata/innsynsdataReducer";

export const getSkalViseVilkarView = (innsynSaksStatusStateListe: SaksStatusState[] | undefined): boolean => {
    return (
        innsynSaksStatusStateListe !== undefined &&
        Array.isArray(innsynSaksStatusStateListe) &&
        innsynSaksStatusStateListe.filter((saksStatusState: SaksStatusState) => saksStatusState.skalViseVedtakInfoPanel)
            .length > 0
    );
};

export const getSkalViseInformasjonsboks = (dokumentasjonkrav: DokumentasjonKrav[], vilkar: Vilkar[]): boolean => {
    const vilkarMedRelevantStatus = vilkar && vilkar.filter((vilkarElement) => vilkarElement.status === "RELEVANT");
    const dokumentasjonKravMedReleavantStatus =
        dokumentasjonkrav &&
        dokumentasjonkrav.filter((krav) =>
            krav.dokumentasjonkravElementer.filter((element) => element.status === "RELEVANT")
        );

    return !(vilkarMedRelevantStatus || dokumentasjonKravMedReleavantStatus);
};
