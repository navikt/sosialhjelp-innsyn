import path from "path";

import { useCallback, useEffect, useState } from "react";
import { logger } from "@navikt/next-logger";
import { useTranslations } from "next-intl";
import { useNavigationGuard } from "next-navigation-guard";

import { logBrukerLeavingBeforeSubmitting, logDuplicatedFiles } from "../../utils/amplitude";
import { VedleggOpplastingResponseStatus } from "../../generated/model";
import {
    allowedFileTypes,
    containsIllegalCharacters,
    isAcceptedFileType,
    maxCombinedFileSize,
    maxFileCount,
    maxFileSize,
} from "../../utils/vedleggUtils";

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

const useFilOpplasting = () => {
    const t = useTranslations("common");

    const [files, setFiles] = useState<FancyFile[]>([]);
    const [outerErrors, setOuterErrors] = useState<Error[]>([]);

    useNavigationGuard({
        enabled: files.length > 0,
        confirm: () => {
            logBrukerLeavingBeforeSubmitting();
            return window.confirm(t("varsling.forlater_siden_uten_aa_sende_inn_vedlegg"));
        },
    });

    const reset = useCallback(() => {
        setFiles([]);
        setOuterErrors([]);
    }, [setFiles, setOuterErrors]);
    useEffect(reset, [reset]);

    const addFiler = useCallback(
        (_files: File[]) => {
            logDuplicatedFiles(_files);

            const updatedFiles = files.concat(
                _files.map((file) => {
                    const error = validateFile(file);
                    return {
                        file,
                        uuid: crypto.randomUUID(),
                        ...(error && { error }),
                    };
                })
            );

            const _outerErrors = getOuterErrors(updatedFiles);

            setFiles(updatedFiles);
            setOuterErrors(_outerErrors);
        },
        [files, setFiles]
    );

    const removeFil = useCallback(
        (fil: FancyFile) => {
            const updatedFiles = files.filter((it) => it.uuid !== fil.uuid);
            const _outerErrors = getOuterErrors(updatedFiles);

            setFiles(updatedFiles);
            setOuterErrors(() => _outerErrors);
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

export const createMetadataFile = (files: FancyFile[], metadata: Metadata): File => {
    // Gammel vedleggslogikk var skrevet ut fra at filer fra flere vedleggsvelgere (med ulike typer) ble sendt sammen til backend.
    // Dette ble løst med å lage en metadata-fil som inneholder informasjon om hvilke filer som hører til hvilke typer
    // Vi har fjernet denne logikken med antagelse om at vi ikke lenger sender filer fra flere vedleggsvelgere samtidig.
    const _metadatas = [{ ...metadata, filer: files.map((fil) => ({ uuid: fil.uuid, filnavn: fil.file.name })) }];
    const metadataFile = new File([JSON.stringify(_metadatas)], "metadata.json", {
        type: "application/json",
    });

    return metadataFile;
};

export const formatFilesForUpload = (files: FancyFile[]): File[] =>
    files.map((file) => {
        const ext = path.extname(file.file.name);
        return new File([file.file], file.uuid + ext, {
            type: file.file.type,
            lastModified: file.file.lastModified,
        });
    });

const validateFile = (file: File): Feil | null => {
    if (file.size > maxFileSize) {
        return Feil.FILE_TOO_LARGE;
    }
    if (containsIllegalCharacters(file.name)) {
        return Feil.ILLEGAL_FILE_NAME;
    }
    if (!isAcceptedFileType(file, allowedFileTypes)) {
        return Feil.ILLEGAL_FILE_TYPE;
    }

    return null;
};

const getOuterErrors = (files: FancyFile[]): Error[] => {
    const outerErrors: Error[] = [];
    if (files.map((file) => file.file).reduce((acc, curr) => acc + curr.size, 0) > maxCombinedFileSize) {
        outerErrors.push({ feil: Feil.COMBINED_TOO_LARGE });
    }
    if (files.length > maxFileCount) {
        logger.info(`Bruker prøver å laste opp for mange filer: ${files.length}`);
        outerErrors.push({ feil: Feil.TOO_MANY_FILES });
    }

    return outerErrors;
};
