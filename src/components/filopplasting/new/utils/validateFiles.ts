import { logger } from "@navikt/next-logger";

import { Feil, FancyFile, Error } from "../types";
import { allowedFileTypes, maxCombinedFileSize, maxFileCount, maxFileSize } from "../consts";

export const containsIllegalCharacters = (filename: string) => {
    /* Filsystemet på macos lagrer fil med 'å' i navnet som 'a\u030A' (a + ring). Dette blir ikke konvertert tilbake før regexen under kjøres. Vi replacer derfor manuelt */
    const fixedFilename = filename.replace("a\u030A", "å").replace("A\u030A", "Å");
    const match = fixedFilename.match(new RegExp("[^a-zæøåA-ZÆØÅ0-9 (),._–-]")); // FIKS takler ikke *, :, <, >, |, ?, \, /. Fonten Helvetica takler færre tegn. Denne brukes til generering av ettersendelse.pdf
    if (match != null) {
        logger.info(`Filnavn inneholdt ugyldige tegn. Det første var ${match[0]}`);
        return true;
    }
    return false;
};

export const isAcceptedFileType = (file: File, accept: string | undefined): boolean => {
    if (!accept) {
        return true;
    }

    const acceptedTypes = accept.split(",");

    return acceptedTypes.some((type) => {
        const validType = type.trim();
        return file.name.toLowerCase().endsWith(validType.toLowerCase());
    });
};

export const validateFile = (file: File): Feil | null => {
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

export const getOuterErrors = (files: FancyFile[]): Error[] => {
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
