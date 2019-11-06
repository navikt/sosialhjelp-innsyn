import {Fil} from "../../redux/innsynsdata/innsynsdataReducer";
import {opprettFormDataMedVedlegg} from "./EttersendelseView";

const pngFile = {filnavn: "test0.png", file: new Blob()} as Fil;
const jpgFile = {filnavn: "test1.jpg", file: new Blob()} as Fil;
const pdfFile = {filnavn: "test3.pdf", file: new Blob()} as Fil;

const expectedMetadata = JSON.stringify([
    {
        type: "annet",
        tilleggsinfo: "annet",
        filer: [
            {filnavn: pngFile.filnavn},
            {filnavn: jpgFile.filnavn},
            {filnavn: pdfFile.filnavn}
        ]
    }
], null, 8);

describe('Ettersendelsetest', () => {

    it('should create correct form and meta data', () => {

        const formData: FormData = opprettFormDataMedVedlegg([pngFile, jpgFile, pdfFile]);
        expect(formData).toBeDefined();

        const formDataEntryValues: FormDataEntryValue[] = formData.getAll("files");
        expect(formDataEntryValues).toBeDefined();
        expect(formDataEntryValues.length).toBe(4);

        const metadataFile = (formDataEntryValues[0] as File);
        expect(metadataFile).toBeDefined();
        expect(metadataFile.name).toBe("metadata.json");

        [
            {file: formDataEntryValues[1], filnavn: pngFile.filnavn},
            {file: formDataEntryValues[2], filnavn: jpgFile.filnavn},
            {file: formDataEntryValues[3], filnavn: pdfFile.filnavn},
        ].forEach((value: {file: FormDataEntryValue, filnavn: string}) => {
            const file = (value.file as File);
            expect(file).toBeDefined();
            expect(file.name).toBe(value.filnavn);
        });

        const actualMetadata = metadataFile["_buffer"].toString();
        expect(actualMetadata).toBe(expectedMetadata);
    });
});
