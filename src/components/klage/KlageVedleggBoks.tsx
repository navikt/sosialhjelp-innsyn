import React from "react";

import AddFileButton from "../filopplasting/AddFileButton";
import FilOpplastingBlokk from "../filopplasting/FilOpplastingBlokk";
import {Error, FancyFile} from "../filopplasting/useFilOpplasting";

interface Props {
    files: FancyFile[];
    removeFil: (fil: FancyFile) => void;
    errors: Error[];
    addFiler: (files: File[]) => void;
    resetStatus: () => void;
}

const KlageVedleggBoks = ({files, removeFil, errors, addFiler, resetStatus}: Props): React.JSX.Element => (
    <FilOpplastingBlokk
        tittel="Legg ved vedlegg"
        beskrivelse="Legg gjerne med vedlegg som kan vise Nav hvorfor du er uenig"
        filer={files}
        onDelete={(_, fil) => removeFil(fil)}
        errors={errors}
        addFileButton={
            <AddFileButton
                onChange={(event) => addFiler(event.currentTarget.files ? Array.from(event.currentTarget.files) : [])}
                id="abc"
                resetStatus={resetStatus}
                title="vedlegg"
            />
        }
        key="abc"
    />
);

export default KlageVedleggBoks;
