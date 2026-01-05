export interface FancyFile {
    file: File;
    error?: Feil;
    uuid: string;
}

export type DokumentKontekst = "dokumentasjonetterspurt" | "dokumentasjonkrav" | "ettersendelse" | "klage";

export interface Metadata {
    dokumentKontekst: DokumentKontekst;
    type: string;
    tilleggsinfo?: string;
    innsendelsesfrist?: string;
    hendelsetype?: string;
    hendelsereferanse?: string;
}

export interface Error {
    feil: Feil;
}

export enum Feil {
    FILE_TOO_LARGE,
    ILLEGAL_FILE_TYPE,
    PDF_ENCRYPTED,
    PDF_SIGNED,
    ILLEGAL_FILE_NAME,
    KLIENTFEIL,
    COULD_NOT_LOAD_DOCUMENT,
    VIRUS,
    COMBINED_TOO_LARGE,
    NO_FILES,
    TOO_MANY_FILES,
}
