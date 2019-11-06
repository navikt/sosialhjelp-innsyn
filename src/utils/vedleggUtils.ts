import {Fil, Oppgave} from "../redux/innsynsdata/innsynsdataReducer";

interface Metadata {
    type: string,
    tilleggsinfo: string | undefined
    filer: Fil[] // Beholder kun filnavn-feltet ved serialisering
}

export function opprettFormDataMedVedleggFraOppgaver(oppgaver: Oppgave[]): FormData {
    const metadata: Metadata[] = oppgaver.map((oppgave: Oppgave) => {
        return {
            type: oppgave.dokumenttype,
            tilleggsinfo: oppgave.tilleggsinformasjon,
            filer: oppgave.filer ? oppgave.filer : []
        }
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
            if (fil.file){
                formData.append("files", fil.file, fil.filnavn);
            }
        });
    });
    return formData;
}
