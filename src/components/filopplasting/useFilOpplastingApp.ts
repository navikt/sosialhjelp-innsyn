import { useCallback, useEffect, useState } from "react";
import { logger } from "@navikt/next-logger";
import { useTranslations } from "next-intl";
import { useNavigationGuard } from "next-navigation-guard";

import { logBrukerLeavingBeforeSubmitting, logDuplicatedFiles } from "../../utils/amplitude";
import { VedleggOpplastingResponseStatus } from "../../generated/model";
import { containsIllegalCharacters, maxCombinedFileSize, maxFileCount, maxFileSize } from "../../utils/vedleggUtils";

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

export const errorStatusToMessage: Record<Feil, string> = {
    [Feil.COMBINED_TOO_LARGE]: "vedlegg.opplasting_feilmelding_COMBINED_FILES_TOO_LARGE",
    [Feil.NO_FILES]: "vedlegg.minst_ett_vedlegg",
    [Feil.COULD_NOT_LOAD_DOCUMENT]: "vedlegg.opplasting_feilmelding_COULD_NOT_LOAD_DOCUMENT",
    [Feil.FILE_TOO_LARGE]: "vedlegg.opplasting_feilmelding_FILE_TOO_LARGE",
    [Feil.ILLEGAL_FILE_TYPE]: "vedlegg.opplasting_feilmelding_ILLEGAL_FILE_TYPE",
    [Feil.PDF_ENCRYPTED]: "vedlegg.opplasting_feilmelding_PDF_IS_ENCRYPTED",
    [Feil.PDF_SIGNED]: "vedlegg.opplasting_feilmelding_PDF_IS_SIGNED",
    [Feil.ILLEGAL_FILE_NAME]: "vedlegg.opplasting_feilmelding_ILLEGAL_FILENAME",
    [Feil.KLIENTFEIL]: "vedlegg.opplasting_backend_feilmelding",
    [Feil.VIRUS]: "vedlegg.opplasting_backend_virus_feilmelding",
    [Feil.TOO_MANY_FILES]: "vedlegg.opplasting_feilmelding_TOO_MANY_FILES",
};

export function determineErrorType(status: VedleggOpplastingResponseStatus): Feil | undefined {
    switch (status) {
        case "ILLEGAL_FILE_TYPE":
            return Feil.ILLEGAL_FILE_TYPE;
        case "COULD_NOT_LOAD_DOCUMENT":
            return Feil.KLIENTFEIL;
        case "PDF_IS_ENCRYPTED":
            return Feil.PDF_ENCRYPTED;
        case "FILE_TOO_LARGE":
            return Feil.FILE_TOO_LARGE;
        case "ILLEGAL_FILENAME":
            return Feil.ILLEGAL_FILE_NAME;
    }
}

const recordFromMetadatas = (metadatas: Metadata[]) =>
    metadatas.reduce((acc, curr, currentIndex) => ({ ...acc, [currentIndex]: [] }), {});

const useFilOpplasting = (metadatas: Metadata[]) => {
    const t = useTranslations("common");

    const [files, setFiles] = useState<Record<number, FancyFile[]>>(recordFromMetadatas(metadatas));
    useNavigationGuard({
        enabled: Object.values(files).flat().length > 0,
        confirm: () => {
            logBrukerLeavingBeforeSubmitting();
            return window.confirm(t("varsling.forlater_siden_uten_aa_sende_inn_vedlegg"));
        },
    });
    const [outerErrors, setOuterErrors] = useState<Error[]>([]);

    /*
    // Tror ikke denne trengs
    const resetStatus = useCallback(() => {
        setOuterErrors([]);
        setEttersendelseUploadSuccess(false);
        setOppgaverUploadSuccess(false);
    }, [setOuterErrors, setOppgaverUploadSuccess, setEttersendelseUploadSuccess]);*/

    const reset = useCallback(() => {
        setFiles(recordFromMetadatas(metadatas));
        setOuterErrors([]);
    }, [metadatas, setFiles, setOuterErrors]);
    useEffect(reset, [reset]);

    const addFiler = useCallback(
        (index: number, _files: File[]) => {
            logDuplicatedFiles(_files);
            const filesWithError: FancyFile[] = _files.map((file) => {
                const fancyFile = { file, uuid: crypto.randomUUID() };
                if (file.size > maxFileSize) {
                    return { ...fancyFile, error: Feil.FILE_TOO_LARGE };
                }
                if (containsIllegalCharacters(file.name)) {
                    return { ...fancyFile, error: Feil.ILLEGAL_FILE_NAME };
                }
                return { file, uuid: crypto.randomUUID() };
            });

            const outerErrors: Error[] = [];
            if (
                _files.concat(files[index].map((it) => it.file)).reduce((acc, curr) => acc + curr.size, 0) >
                maxCombinedFileSize
            ) {
                outerErrors.push({ feil: Feil.COMBINED_TOO_LARGE });
            }
            const totalFiles = _files.length + Object.values(files).flat().length;
            if (totalFiles > maxFileCount) {
                logger.info(`Bruker prøver å laste opp for mange filer: ${totalFiles}`);
                outerErrors.push({ feil: Feil.TOO_MANY_FILES });
            }
            setFiles((prev) => ({
                ...prev,
                [index]: [...prev[index], ...filesWithError],
            }));

            setOuterErrors(outerErrors);
        },
        [files, setFiles]
    );

    const removeFil = useCallback(
        (index: number, fil: FancyFile) => {
            const _files = Object.values(files).flat();
            setFiles((prev) => ({ ...prev, [index]: prev[index].filter((it) => it.uuid !== fil.uuid) }));
            // Update "global" errors
            const _errors: (Error | ErrorWithFile)[] = [];
            if (
                _files.filter((it) => it.uuid !== fil.uuid).reduce((acc, curr) => acc + curr.file.size, 0) >
                maxCombinedFileSize
            ) {
                _errors.push({ feil: Feil.COMBINED_TOO_LARGE });
            }
            if (_files.length - 1 > maxFileCount) {
                _errors.push({ feil: Feil.TOO_MANY_FILES });
            }
            setOuterErrors(() => _errors);
        },
        [setFiles, files]
    );

    return {
        outerErrors,
        files,
        addFiler,
        setOuterErrors,
        removeFil,
        reset,
    };
};

export default useFilOpplasting;
