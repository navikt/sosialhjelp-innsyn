import {Fil} from "../../redux/innsynsdata/innsynsdataReducer";
import {containsIllegalCharacters, illegalFileSize} from "../../utils/vedleggUtils";
import {fileUploadFailedEvent} from "../../utils/amplitude";

export const validateFile = (files: Fil[]) => {
    const errors = new Set<string>();
    const filenames = new Set<string>();

    files.forEach((file) => {
        if (file.file && illegalFileSize(file.file)) {
            errors.add("vedlegg.ulovlig_filstorrelse_feilmelding");
            filenames.add(file.filnavn);
            fileUploadFailedEvent("vedlegg.ulovlig_filstorrelse_feilmelding");
        }

        if (file.file && containsIllegalCharacters(file.file.name)) {
            errors.add("vedlegg.ulovlig_filnavn_feilmelding");
            filenames.add(file.filnavn);
            fileUploadFailedEvent("vedlegg.ulovlig_filnavn_feilmelding");
        }
    });
    const validFiles = files.filter((file) => !filenames.has(file.filnavn));
    return {validFiles, errors, filenames};
};
