import {Fil, DokumentasjonEtterspurt, DokumentasjonEtterspurtElement} from "../redux/innsynsdata/innsynsdataReducer";
import {logWarningMessage, logInfoMessage} from "../redux/innsynsdata/loggActions";
import {OriginalSoknadVedleggType} from "../redux/soknadsdata/vedleggTypes";
import {originalSoknadVedleggTekstVisning} from "../redux/soknadsdata/vedleggskravVisningConfig";
import ReturnErrorMessage from "../components/oppgaver/ReturnErrorMessage";

export const maxMengdeStorrelse = 150 * 1024 * 1024;
export const maxFilStorrelse = 10 * 1024 * 1024;

export enum HendelseTypeEnum {
    BRUKER = "bruker",
    SOKNAD = "soknad",
    DOKUMENTASJON_ETTERSPURT = "dokumentasjonEtterspurt",
    DOKUMENTASJONKRAV = "dokumentasjonkrav",
}

interface Metadata {
    type: string;
    tilleggsinfo: string | undefined;
    filer: Fil[]; // Beholder kun filnavn-feltet ved serialisering
    innsendelsesfrist: string | undefined;
    hendelsetype: HendelseTypeEnum | undefined;
    hendelsereferanse: string | undefined;
}

export function opprettFormDataMedVedleggFraOppgaver(oppgave: DokumentasjonEtterspurt) {
    const metadata: Metadata[] = generateMetadataFromOppgaver(oppgave);
    return opprettFormDataMedVedlegg(metadata);
}

export function generateMetadataFromOppgaver(oppgave: DokumentasjonEtterspurt) {
    return oppgave.oppgaveElementer.map((oppgaveElement: DokumentasjonEtterspurtElement) => ({
        type: oppgaveElement.dokumenttype,
        tilleggsinfo: oppgaveElement.tilleggsinformasjon,
        innsendelsesfrist: oppgave.innsendelsesfrist,
        filer: oppgaveElement.filer ? oppgaveElement.filer : [],
        hendelsetype: oppgaveElement.hendelsetype,
        hendelsereferanse: oppgaveElement.hendelsereferanse,
    }));
}

export function opprettFormDataMedVedleggFraFiler(filer: Fil[]): FormData {
    const metadata: Metadata[] = generateMetadataFromAndreVedlegg(filer);
    return opprettFormDataMedVedlegg(metadata);
}

export function generateMetadataFromAndreVedlegg(filer: Fil[]): Metadata[] {
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
}

function opprettFormDataMedVedlegg(metadata: Metadata[]): FormData {
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
}

export function hentFileExtension(filnavn: string) {
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

export const harFilerMedFeil = (oppgaveElementer: DokumentasjonEtterspurtElement[]) => {
    return oppgaveElementer.find((oppgaveElement) => {
        return !oppgaveElement.filer
            ? false
            : oppgaveElement.filer.find((it) => {
                  return it.status !== "OK" && it.status !== "PENDING" && it.status !== "INITIALISERT";
              });
    });
};

export function skrivFeilmelding(listeMedFil: Array<FilFeil>, oppgaveElementIndex: number) {
    let filnavn = "";

    const flagg = {
        ulovligFil: false,
        ulovligFiler: false,
        legalFileExtension: false,
        containsUlovligeTegn: false,
        maxFilStorrelse: false,
        maxSammensattFilStorrelse: false,
    };

    listeMedFil.forEach((value) => {
        if (value.oppgaveElemendIndex === oppgaveElementIndex) {
            if (
                value.containsUlovligeTegn ||
                value.legalFileSize ||
                value.legalFileExtension ||
                value.legalCombinedFilesSize
            ) {
                if (listeMedFil.length === 1) {
                    filnavn = listeMedFil.length === 1 ? listeMedFil[0].filename : "";
                    flagg.ulovligFil = true;
                } else {
                    flagg.ulovligFiler = true;
                    flagg.ulovligFil = false;
                }
                if (value.legalFileSize) {
                    flagg.maxFilStorrelse = true;
                }
                if (value.containsUlovligeTegn) {
                    flagg.containsUlovligeTegn = true;
                }
                if (value.legalFileExtension) {
                    flagg.legalFileExtension = true;
                }
                if (value.legalCombinedFilesSize) {
                    flagg.maxSammensattFilStorrelse = true;
                    flagg.maxFilStorrelse = false;
                    flagg.containsUlovligeTegn = false;
                    flagg.legalFileExtension = false;
                    flagg.ulovligFiler = false;
                    flagg.ulovligFil = false;
                }
            }
        }
    });

    return ReturnErrorMessage(flagg, filnavn, listeMedFil);
}

export function finnFilerMedFeil(files: FileList, oppgaveElemendIndex: number): Array<FilFeil> {
    let sjekkMaxMengde = false;
    const filerMedFeil: Array<FilFeil> = [];
    let isCombinedFileSizeLegal = 0;

    for (let vedleggIndex = 0; vedleggIndex < files.length; vedleggIndex++) {
        const file: File = files[vedleggIndex];
        const filename = file.name;

        let fileErrorObject: FilFeil = {
            legalFileExtension: false,
            containsUlovligeTegn: false,
            legalFileSize: false,
            legalCombinedFilesSize: false,
            arrayIndex: vedleggIndex,
            oppgaveElemendIndex: oppgaveElemendIndex,
            filename: filename,
        };

        if (!legalFileExtension(filename)) {
            fileErrorObject.legalFileExtension = true;
        }
        if (containsUlovligeTegn(filename)) {
            fileErrorObject.containsUlovligeTegn = true;
        }
        if (legalFileSize(file)) {
            fileErrorObject.legalFileSize = true;
        }
        if (legalCombinedFilesSize(isCombinedFileSizeLegal)) {
            sjekkMaxMengde = true;
            fileErrorObject.legalCombinedFilesSize = true;
        }

        if (
            fileErrorObject.legalFileExtension ||
            fileErrorObject.containsUlovligeTegn ||
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
}

export function harIkkeValgtFiler(oppgave: DokumentasjonEtterspurt | null) {
    let antall = 0;
    oppgave &&
        oppgave.oppgaveElementer.forEach((oppgaveElement: DokumentasjonEtterspurtElement) => {
            oppgaveElement.filer &&
                oppgaveElement.filer.forEach(() => {
                    antall += 1;
                });
        });
    return antall === 0;
}
