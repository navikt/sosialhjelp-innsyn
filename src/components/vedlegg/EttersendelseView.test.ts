import {Fil} from "../../redux/innsynsdata/innsynsdataReducer";
import {opprettFormDataMedVedlegg} from "./EttersendelseView";

const pngFile = {filnavn: "test0.png", file: new Blob()} as Fil;
const jpgFile = {filnavn: "test1.jpg", file: new Blob()} as Fil;
const pdfFile = {filnavn: "test3.pdf", file: new Blob()} as Fil;

const expectedMetadata = JSON.stringify([
    {
        type: "annet",
        "tilleggsinfo": "annet",
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

        const file1 = (formDataEntryValues[0] as File);
        expect(file1.name).toBeDefined();
        expect(file1.name).toBe("metadata.json");

        const file2 = (formDataEntryValues[1] as File);
        expect(file2.name).toBeDefined();
        expect(file2.name).toBe(pngFile.filnavn);

        const file3 = (formDataEntryValues[2] as File);
        expect(file3.name).toBeDefined();
        expect(file3.name).toBe(jpgFile.filnavn);

        const file4 = (formDataEntryValues[3] as File);
        expect(file4.name).toBeDefined();
        expect(file4.name).toBe(pdfFile.filnavn);

        const actualMetadata = file1["_buffer"].toString();
        expect(actualMetadata).toBe(expectedMetadata);
    });
});
