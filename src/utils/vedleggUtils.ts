import {Fil, Oppgave, OppgaveElement} from "../redux/innsynsdata/innsynsdataReducer";
import {logInfoMessage} from "../redux/innsynsdata/innsynsDataActions";

interface Metadata {
    type: string,
    tilleggsinfo: string | undefined
    filer: Fil[] // Beholder kun filnavn-feltet ved serialisering
}

export function opprettFormDataMedVedleggFraOppgaver(oppgaver: Oppgave[]): FormData {
    const metadata: Metadata[] = [];
    oppgaver.forEach((oppgave: Oppgave) => {
        oppgave.oppgaveElementer.forEach((oppgaveElement: OppgaveElement) => {
            metadata.push({
                type: oppgaveElement.dokumenttype,
                tilleggsinfo: oppgaveElement.tilleggsinformasjon,
                filer: oppgaveElement.filer ? oppgaveElement.filer : []
            });
        });
    });
    return opprettFormDataMedVedlegg(metadata);
}

export function opprettFormDataMedVedleggFraFiler(filer: Fil[]): FormData {
    const metadata: Metadata[] = [
        {
            type: "annet",
            tilleggsinfo: "annet",
            filer: filer
        }
    ];
    return opprettFormDataMedVedlegg(metadata);
}

function opprettFormDataMedVedlegg(metadata: Metadata[]): FormData {
    let formData = new FormData();
    // Metadata skal ikke inneholde file-blob fra Fil-typen
    const metadataJson = JSON.stringify(metadata, ["type", "tilleggsinfo", "filer", "filnavn"], 8);
    const metadataBlob = new Blob([metadataJson], {type: 'application/json'});
    formData.append("files", metadataBlob, "metadata.json");
    metadata.forEach((filgruppe: Metadata) => {
        filgruppe.filer.forEach((fil: Fil) => {
            if (fil.file) {
                formData.append("files", fil.file, fil.filnavn);
            }
        });
    });
    return formData;
}

export function containsUlovligeTegn(filnavn: string) {
    // const match = filnavn.match(new RegExp("[^a-zæøåA-ZÆØÅ0-9 (),._–-]")); // FIKS takler ikke *, :, <, >, |, ?, \, /. Fonten Helvetica takler færre tegn. Denne brukes til generering av ettersendelse.pdf
    // if (match != null) {
    //     logInfoMessage(`Filnavn inneholdt ugyldige tegn. Det første var ${match[0]}`);
    //     return true;
    // }
    return false;
}
