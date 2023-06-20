interface HistorikkTekst {
    [key: string]: string;
}

export const HistorikkTekstEnum: HistorikkTekst = {
    SOKNAD_SEND_TIL_KONTOR: "hendelse.soknad_sendt_til_kontor",
    SOKNAD_MOTTATT_MED_KOMMUNENAVN: "hendelse.soknad_mottatt_hos_kommune",
    SOKNAD_MOTTATT_UTEN_KOMMUNENAVN: "hendelse.soknad_mottatt",
    SOKNAD_UNDER_BEHANDLING: "hendelse.soknad_under_behandling",
    SOKNAD_FERDIGBEHANDLET: "hendelse.soknad_ferdigbehandlet",
    SOKNAD_BEHANDLES_IKKE: "hendelse.soknad_behandles_ikke",
    SOKNAD_VIDERESENDT_PAPIRSOKNAD_MED_NORG_ENHET: "hendelse.soknad_videresendt_papirsoknad_med_norg_enhet",
    SOKNAD_VIDERESENDT_PAPIRSOKNAD_UTEN_NORG_ENHET: "hendelse.soknad_videresendt_papirsoknad_uten_norg_enhet",
    SOKNAD_VIDERESENDT_MED_NORG_ENHET: "hendelse.soknad_videresendt_med_norg_enhet",
    SOKNAD_VIDERESENDT_UTEN_NORG_ENHET: "hendelse.soknad_videresendt_uten_norg_enhet",
    SOKNAD_KAN_IKKE_VISE_STATUS_MED_TITTEL: "hendelse.soknad_kan_ikke_vise_status_med_tittel",
    SOKNAD_KAN_IKKE_VISE_STATUS_UTEN_TITTEL: "hendelse.soknad_kan_ikke_vise_status_uten_tittel",
    SAK_UNDER_BEHANDLING_MED_TITTEL: "hendelse.sak_under_behandling_med_tittel",
    SAK_UNDER_BEHANDLING_UTEN_TITTEL: "hendelse.sak_under_behandling_uten_tittel",
    SAK_FERDIGBEHANDLET_MED_TITTEL: "hendelse.sak_ferdigbehandlet_med_tittel",
    SAK_FERDIGBEHANDLET_UTEN_TITTEL: "hendelse.sak_ferdigbehandlet_uten_tittel",
    SAK_KAN_IKKE_VISE_STATUS_MED_TITTEL: "hendelse.sak_kan_ikke_vises_status_med_tittel",
    SAK_KAN_IKKE_VISE_STATUS_UTEN_TITTEL: "hendelse.sak_kan_ikke_vises_status_uten_tittel",
    ANTALL_SENDTE_VEDLEGG: "hendelse.antalle_sendte_vedlegg",
    VILKAR_OPPDATERT: "hendelse.vilkar_oppdatert",
    UTBETALINGER_OPPDATERT: "hendelse.utbetalinger_oppdatert",
    BREV_OM_SAKSBEANDLINGSTID: "hendelse.brev_om_saksbehandlingstid",
    ETTERSPOR_MER_DOKUMENTASJON: "hendelse.etterspor_mer_dokumentasjon",
    ETTERSPOR_IKKE_MER_DOKUMENTASJON: "hendelse.etterspor_ikke_mer_dokumentasjon",
    DOKUMENTASJONKRAV: "hendelse.dokumentasjonkrav",
};
