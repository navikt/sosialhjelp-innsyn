export enum OriginalSoknadVedleggType {
    LONNSLIPP_ARBEID = "lonnslipp|arbeid",
    SLUTTOPPGJOR_ARBEID = "sluttoppgjor|arbeid",
    STUDENT_VEDTAK = "student|vedtak",
    BARNEBIDRAG_BETALER = "barnebidrag|betaler",
    BARNEBIDRAG_MOTTAR = "barnebidrag|mottar",
    SAMVARSAVTALE_BARN = "samvarsavtale|barn",
    HUSLEIEKONTRAKT_HUSLEIEKONTRAKT = "husleiekontrakt|husleiekontrakt",
    HUSLEIEKONTRAKT_KOMMUNAL = "husleiekontrakt|kommunal",
    BOSTOTTE_VEDTAK = "bostotte|vedtak",
    KONTOOVERSIKT_BRUKSKONTO = "kontooversikt|brukskonto",
    KONTOOVERSIKT_BSU = "kontooversikt|bsu",
    KONTOOVERSIKT_SPAREKONTO = "kontooversikt|sparekonto",
    KONTOOVERSIKT_LIVSFORSIKRING = "kontooversikt|livsforsikring",
    KONTOOVERSIKT_AKSJER = "kontooversikt|aksjer",
    KONTOOVERSIKT_ANNET = "kontooversikt|annet",
    DOKUMENTASJON_UTBYTTE = "dokumentasjon|utbytte",
    SALGSOPPGJOR_EIENDOM = "salgsoppgjor|eiendom",
    DOKUMENTASJON_FORSIKRINGSUTBETALING = "dokumentasjon|forsikringsutbetaling",
    DOKUMENTASJON_ANNETINNTEKTER = "dokumentasjon|annetinntekter",
    FAKTURA_HUSLEIE = "faktura|husleie",
    FAKTURA_STROM = "faktura|strom",
    FAKTURA_KOMMUNALEAVGIFTER = "faktura|kommunaleavgifter",
    FAKTURA_OPPVARMING = "faktura|oppvarming",
    NEDBETALINGSPLAN_AVDRAGLAAN = "nedbetalingsplan|avdraglaan",
    DOKUMENTASJON_ANNETBOUTGIFT = "dokumentasjon|annetboutgift",
    FAKTURA_FRITIDSAKTIVITET = "faktura|fritidsaktivitet",
    FAKTURA_BARNEHAGE = "faktura|barnehage",
    FAKTURA_SFO = "faktura|sfo",
    FAKTURA_TANNBEHANDLING = "faktura|tannbehandling",
    FAKTURA_ANNETBARNUTGIFT = "faktura|annetbarnutgift",
    SKATTEMELDING_SKATTEMELDING = "skattemelding|skattemelding",
    OPPHOLDSTILLATEL_OPPHOLDSTILLATEL= "oppholdstillatel|oppholdstillatel"
}
export interface OriginalSoknadVedleggSpec {
    type: OriginalSoknadVedleggType;
    tittel: string;
    tilleggsinfo: string;
}
