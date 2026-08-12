import { Feil } from "../types";

export const errorStatusToMessage: Record<Feil, string> = {
    [Feil.COMBINED_TOO_LARGE]: "feil.opplasting_feilmelding_COMBINED_FILES_TOO_LARGE",
    [Feil.NO_FILES]: "feil.minst_ett_vedlegg",
    [Feil.COULD_NOT_LOAD_DOCUMENT]: "feil.opplasting_feilmelding_COULD_NOT_LOAD_DOCUMENT",
    [Feil.FILE_TOO_LARGE]: "feil.opplasting_feilmelding_FILE_TOO_LARGE",
    [Feil.ILLEGAL_FILE_TYPE]: "feil.opplasting_feilmelding_ILLEGAL_FILE_TYPE",
    [Feil.PDF_ENCRYPTED]: "feil.opplasting_feilmelding_PDF_IS_ENCRYPTED",
    [Feil.PDF_SIGNED]: "feil.opplasting_feilmelding_PDF_IS_SIGNED",
    [Feil.ILLEGAL_FILE_NAME]: "feil.opplasting_feilmelding_ILLEGAL_FILENAME",
    [Feil.KLIENTFEIL]: "feil.opplasting_backend_feilmelding",
    [Feil.VIRUS]: "feil.opplasting_backend_virus_feilmelding",
    [Feil.TOO_MANY_FILES]: "feil.opplasting_feilmelding_TOO_MANY_FILES",
};
