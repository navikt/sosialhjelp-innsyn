import path from "path";

import { FancyFile, Metadata } from "../types";

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
