import { logger } from "@navikt/next-logger";

import { OriginalSoknadVedleggType } from "../redux/soknadsdata/vedleggTypes";
import { originalSoknadVedleggTekstVisning } from "../redux/soknadsdata/vedleggskravVisningConfig";

export const maxCombinedFileSize = 150 * 1024 * 1024; // max bytes lov å laste opp totalt
export const maxFileSize = 10 * 1024 * 1024; // max bytes per fil
export const maxFileCount = 30; // max antall filer som kan lastes opp
export const allowedFileTypes = ".jpeg,.png,.pdf";

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

export const getVisningstekster = (type: string, tilleggsinfo: string | undefined) => {
    const sammensattType = type + "|" + tilleggsinfo;
    const erOriginalSoknadVedleggType = Object.values(OriginalSoknadVedleggType).some((val) => val === sammensattType);

    let typeTekst = type;
    let tilleggsinfoTekst = tilleggsinfo;
    if (erOriginalSoknadVedleggType) {
        const soknadVedleggSpec = originalSoknadVedleggTekstVisning.find((spc) => spc.type === sammensattType)!;
        typeTekst = soknadVedleggSpec.tittel;
        tilleggsinfoTekst = soknadVedleggSpec.tilleggsinfo;
    }

    return { typeTekst, tilleggsinfoTekst };
};
