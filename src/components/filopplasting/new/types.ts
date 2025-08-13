import { VedleggOpplastingResponseStatus } from "@generated/model";

export interface FancyFile {
    file: File;
    error?: Feil;
    uuid: string;
}

export interface Metadata {
    type: string;
    tilleggsinfo?: string;
    innsendelsesfrist?: string;
    hendelsetype?: string;
    hendelsereferanse?: string;
}

export interface Error {
    feil: Feil;
}

export interface ErrorWithFile extends Error {
    fil: File;
    filnavn: string;
}

export interface Mutation {
    isLoading: boolean;
    isError?: boolean;
    error?: Error | ErrorWithFile;
    data?: { filer: { status: VedleggOpplastingResponseStatus; filnavn: string }[] }[];
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
