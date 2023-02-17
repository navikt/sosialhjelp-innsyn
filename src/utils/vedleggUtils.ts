import {
    Fil,
    DokumentasjonEtterspurt,
    DokumentasjonEtterspurtElement,
    HendelseTypeEnum,
} from "../redux/innsynsdata/innsynsdataReducer";
import {logWarningMessage, logInfoMessage} from "../redux/innsynsdata/loggActions";
import {OriginalSoknadVedleggType} from "../redux/soknadsdata/vedleggTypes";
import {originalSoknadVedleggTekstVisning} from "../redux/soknadsdata/vedleggskravVisningConfig";
import {DokumentasjonkravElement} from "../generated/model";

export const maxCombinedFileSize = 150 * 1024 * 1024; // max bytes lov å laste opp totalt
export const maxFileSize = 10 * 1024 * 1024; // max bytes per fil

interface Metadata {
    type: string;
    tilleggsinfo: string | undefined;
    filer: Fil[]; // Beholder kun filnavn-feltet ved serialisering
    innsendelsesfrist: string | undefined;
    hendelsetype: string | undefined;
    hendelsereferanse: string | undefined;
}

export const createFormDataWithVedleggFromOppgaver = (oppgave: DokumentasjonEtterspurt) => {
    const metadata: Metadata[] = generateMetadataFromOppgaver(oppgave);
    return opprettFormDataMedVedlegg(metadata);
};

export const createFormDataWithVedleggFromDokumentasjonkrav = (
    dokumentasjonkravElement: DokumentasjonkravElement,
    filer: Fil[],
    frist?: string
) => {
    const metadata: Metadata[] = generateMetadataFromDokumentasjonkrav(dokumentasjonkravElement, filer, frist);
    return opprettFormDataMedVedlegg(metadata);
};

export const generateMetadataFromOppgaver = (oppgave: DokumentasjonEtterspurt) => {
    return oppgave.oppgaveElementer.map((oppgaveElement: DokumentasjonEtterspurtElement) => ({
        type: oppgaveElement.dokumenttype,
        tilleggsinfo: oppgaveElement.tilleggsinformasjon,
        innsendelsesfrist: oppgave.innsendelsesfrist,
        filer: oppgaveElement.filer ?? [],
        hendelsetype: oppgaveElement.hendelsetype,
        hendelsereferanse: oppgaveElement.hendelsereferanse,
    }));
};

export const generateMetadataFromDokumentasjonkrav = (
    dokumentasjonkravElement: DokumentasjonkravElement,
    filer: Fil[],
    frist?: string
): Metadata[] => [
    {
        type: dokumentasjonkravElement.tittel ? dokumentasjonkravElement.tittel : "",
        tilleggsinfo: dokumentasjonkravElement.beskrivelse,
        innsendelsesfrist: frist,
        filer: filer,
        hendelsetype: dokumentasjonkravElement.hendelsetype,
        hendelsereferanse: dokumentasjonkravElement.dokumentasjonkravReferanse,
    },
];

export const createFormDataWithVedleggFromFiler = (filer: Fil[]): FormData => {
    const metadata: Metadata[] = generateMetadataFromAndreVedlegg(filer);
    return opprettFormDataMedVedlegg(metadata);
};

export const generateMetadataFromAndreVedlegg = (filer: Fil[]): Metadata[] => {
    return [
        {
            type: "annet",
            tilleggsinfo: "annet",
            filer: filer,
            innsendelsesfrist: undefined,
            hendelsetype: HendelseTypeEnum.BRUKER,
            hendelsereferanse: undefined,
        },
    ];
};

const opprettFormDataMedVedlegg = (metadata: Metadata[]): FormData => {
    let formData = new FormData();
    // Metadata skal ikke inneholde file-blob fra Fil-typen
    const metadataJson = JSON.stringify(
        metadata,
        ["type", "tilleggsinfo", "innsendelsesfrist", "hendelsetype", "hendelsereferanse", "filer", "filnavn"],
        8
    );
    const metadataBlob = new Blob([metadataJson], {type: "application/json"});
    formData.append("files", metadataBlob, "metadata.json");
    metadata.forEach((filgruppe: Metadata) => {
        filgruppe.filer.forEach((fil: Fil) => {
            if (fil) {
                if (fil.file) {
                    formData.append("files", fil.file, fil.filnavn);
                } else {
                    if (fil.filnavn) {
                        logWarningMessage(
                            "Finner ikke innholdet til en fil av type: " + hentFileExtension(fil.filnavn)
                        );
                    }
                    logWarningMessage("Fil uten filnavn og innhold ble forsøkt lagt til i opprettFormDataMedVedlegg()");
                }
            } else {
                logWarningMessage("Udefinert fil ble forsøkt lagt til i opprettFormDataMedVedlegg()");
            }
        });
    });
    return formData;
};

export const hentFileExtension = (filnavn: string) => {
    var filetternavn = "ukjent";
    if (filnavn.length >= 5) {
        var testSteng = filnavn.substr(filnavn.length - 5, 5);
        const punktumPosisjon = testSteng.indexOf(".");
        if (punktumPosisjon > -1) {
            filetternavn = testSteng.substr(punktumPosisjon + 1, 4 - punktumPosisjon);
        }
    }
    return filetternavn;
};

export const containsIllegalCharacters = (filename: string) => {
    /* Filsystemet på macos lagrer fil med 'å' i navnet som 'a\u030A' (a + ring). Dette blir ikke konvertert tilbake før regexen under kjøres. Vi replacer derfor manuelt */
    const fixedFilename = filename.replace("a\u030A", "å").replace("A\u030A", "Å");
    const match = fixedFilename.match(new RegExp("[^a-zæøåA-ZÆØÅ0-9 (),._–-]")); // FIKS takler ikke *, :, <, >, |, ?, \, /. Fonten Helvetica takler færre tegn. Denne brukes til generering av ettersendelse.pdf
    if (match != null) {
        logInfoMessage(`Filnavn inneholdt ugyldige tegn. Det første var ${match[0]}`);
        return true;
    }
    return false;
};

export const illegalCombinedFilesSize = (sammensattFilStorrelse: number) => {
    return sammensattFilStorrelse > maxCombinedFileSize;
};

export const illegalFileSize = (file: File) => {
    return file.size > maxFileSize;
};

export interface FileError {
    containsIllegalCharacters: boolean;
    legalFileSize: boolean;
    legalCombinedFilesSize: boolean;
    arrayIndex: number;
    oppgaveElementIndex: number;
    filename: string;
}

export const isFileErrorsNotEmpty = (fileErrors: Array<FileError>) => {
    return !!(fileErrors && fileErrors.length);
};

export const alertUser = (event: any) => {
    event.preventDefault();
    event.returnValue = "";
};

export const getVisningstekster = (type: string, tilleggsinfo: string | undefined) => {
    let typeTekst,
        tilleggsinfoTekst,
        sammensattType = type + "|" + tilleggsinfo,
        erOriginalSoknadVedleggType = Object.values(OriginalSoknadVedleggType).some((val) => val === sammensattType);

    if (erOriginalSoknadVedleggType) {
        let soknadVedleggSpec = originalSoknadVedleggTekstVisning.find((spc) => spc.type === sammensattType)!!;
        typeTekst = soknadVedleggSpec.tittel;
        tilleggsinfoTekst = soknadVedleggSpec.tilleggsinfo;
    } else {
        typeTekst = type;
        tilleggsinfoTekst = tilleggsinfo;
    }
    return {typeTekst, tilleggsinfoTekst};
};

export const oppgaveHasFilesWithError = (oppgaveElementer: DokumentasjonEtterspurtElement[]) => {
    return oppgaveElementer.find((oppgaveElement) => {
        return !oppgaveElement.filer ? false : hasFilesWithErrorStatus(oppgaveElement.filer);
    });
};

export const hasFilesWithErrorStatus = (filer: Fil[]) => {
    return filer.find((it) => {
        return it.status !== "OK" && it.status !== "PENDING" && it.status !== "INITIALISERT";
    });
};

export const findFilesWithError = (files: FileList, oppgaveElementIndex: number): Array<FileError> => {
    let sjekkMaxMengde = false;
    const filerMedFeil: Array<FileError> = [];
    let isCombinedFileSizeLegal = 0;
    for (let vedleggIndex = 0; vedleggIndex < files.length; vedleggIndex++) {
        const file: File = files[vedleggIndex];
        const filename = file.name;

        let fileErrorObject: FileError = {
            containsIllegalCharacters: false,
            legalFileSize: false,
            legalCombinedFilesSize: false,
            arrayIndex: vedleggIndex,
            oppgaveElementIndex: oppgaveElementIndex,
            filename: filename,
        };

        if (containsIllegalCharacters(filename)) {
            fileErrorObject.containsIllegalCharacters = true;
        }
        if (illegalFileSize(file)) {
            fileErrorObject.legalFileSize = true;
        }
        if (illegalCombinedFilesSize(isCombinedFileSizeLegal)) {
            sjekkMaxMengde = true;
            fileErrorObject.legalCombinedFilesSize = true;
        }

        if (
            fileErrorObject.containsIllegalCharacters ||
            fileErrorObject.legalFileSize ||
            fileErrorObject.legalCombinedFilesSize
        ) {
            filerMedFeil.push(fileErrorObject);
        }
        isCombinedFileSizeLegal += file.size;
    }

    if (sjekkMaxMengde) {
        logInfoMessage(
            "Bruker prøvde å laste opp over 150 mb. Størrelse på vedlegg var: " +
                isCombinedFileSizeLegal / (1024 * 1024)
        );
    }
    return filerMedFeil;
};

export const hasNotAddedFiles = (oppgave: DokumentasjonEtterspurt | null) => {
    let antall = 0;
    oppgave &&
        oppgave.oppgaveElementer.forEach((oppgaveElement: DokumentasjonEtterspurtElement) => {
            oppgaveElement.filer &&
                oppgaveElement.filer.forEach(() => {
                    antall += 1;
                });
        });
    return antall === 0;
};
