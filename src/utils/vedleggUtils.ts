import {Fil, Oppgave, OppgaveElement} from "../redux/innsynsdata/innsynsdataReducer";
import {logErrorMessage, logInfoMessage} from "../redux/innsynsdata/loggActions";

export const maxMengdeStorrelse = 150 * 1024 * 1024;
export const maxFilStorrelse = 10 * 1024 * 1024;

interface Metadata {
    type: string;
    tilleggsinfo: string | undefined;
    filer: Fil[]; // Beholder kun filnavn-feltet ved serialisering
    innsendelsesfrist: string | undefined;
}

export function opprettFormDataMedVedleggFraOppgaver(oppgave: Oppgave) {
    const metadata: Metadata[] = [];
    oppgave.oppgaveElementer.forEach((oppgaveElement: OppgaveElement) => {
        metadata.push({
            type: oppgaveElement.dokumenttype,
            tilleggsinfo: oppgaveElement.tilleggsinformasjon,
            innsendelsesfrist: oppgave.innsendelsesfrist,
            filer: oppgaveElement.filer ? oppgaveElement.filer : [],
        });
    });
    return opprettFormDataMedVedlegg(metadata);
}

export function opprettFormDataMedVedleggFraFiler(filer: Fil[]): FormData {
    const metadata: Metadata[] = [
        {
            type: "annet",
            tilleggsinfo: "annet",
            filer: filer,
            innsendelsesfrist: undefined,
        },
    ];
    return opprettFormDataMedVedlegg(metadata);
}

function opprettFormDataMedVedlegg(metadata: Metadata[]): FormData {
    let formData = new FormData();
    // Metadata skal ikke inneholde file-blob fra Fil-typen
    const metadataJson = JSON.stringify(metadata, ["type", "tilleggsinfo", "innsendelsesfrist", "filer", "filnavn"], 8);
    const metadataBlob = new Blob([metadataJson], {type: "application/json"});
    formData.append("files", metadataBlob, "metadata.json");
    metadata.forEach((filgruppe: Metadata) => {
        filgruppe.filer.forEach((fil: Fil) => {
            if (fil) {
                if (fil.file) {
                    formData.append("files", fil.file, fil.filnavn);
                } else {
                    if (fil.filnavn) {
                        logErrorMessage("Finner ikke innholdet til en fil av type: " + hentFiletternavn(fil.filnavn));
                    }
                    logErrorMessage("Fil uten filnavn og innhold ble forsøkt lagt til i opprettFormDataMedVedlegg()");
                }
            } else {
                logErrorMessage("Udefinert fil ble forsøkt lagt til i opprettFormDataMedVedlegg()");
            }
        });
    });
    return formData;
}

export function hentFiletternavn(filnavn: string) {
    var filetternavn = "ukjent";
    if (filnavn.length >= 5) {
        var testSteng = filnavn.substr(filnavn.length - 5, 5);
        const punktumPosisjon = testSteng.indexOf(".");
        if (punktumPosisjon > -1) {
            filetternavn = testSteng.substr(punktumPosisjon + 1, 4 - punktumPosisjon);
        }
    }
    return filetternavn;
}

export function containsUlovligeTegn(filnavn: string) {
    /* Filsystemet på macos lagrer fil med 'å' i navnet som 'a\u030A' (a + ring). Dette blir ikke konvertert tilbake før regexen under kjøres. Vi replacer derfor manuelt */
    const fixedFilenavn = filnavn.replace("a\u030A", "å").replace("A\u030A", "Å");
    const match = fixedFilenavn.match(new RegExp("[^a-zæøåA-ZÆØÅ0-9 (),._–-]")); // FIKS takler ikke *, :, <, >, |, ?, \, /. Fonten Helvetica takler færre tegn. Denne brukes til generering av ettersendelse.pdf
    if (match != null) {
        logInfoMessage(`Filnavn inneholdt ugyldige tegn. Det første var ${match[0]}`);
        return true;
    }
    return false;
}

export function legalCombinedFilesSize(sammensattFilStorrelse: number) {
    return sammensattFilStorrelse > maxMengdeStorrelse;
}

export function legalFileSize(file: File) {
    return file.size > maxFilStorrelse;
}

export function legalFileExtension(filename: string) {
    const fileExtension = filename.replace(/^.*\./, "");
    return fileExtension.match(/jpe?g|png|pdf/i) !== null;
}

export interface FilFeil {
    legalFileExtension: boolean;
    containsUlovligeTegn: boolean;
    legalFileSize: boolean;
    legalCombinedFilesSize: boolean;
    arrayIndex: number;
    oppgaveElemendIndex: number;
    filename: string;
}

export function validerFilArrayForFeil(listeMedFil: Array<FilFeil>) {
    return !!(listeMedFil && listeMedFil.length);
}
