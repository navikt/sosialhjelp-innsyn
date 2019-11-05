import {Fil} from "../../redux/innsynsdata/innsynsdataReducer";
import {genererMetatadataJson, opprettFormDataMedVedlegg} from "./EttersendelseView";

const pngFile = {filnavn: "test0.png", file: new Blob()} as Fil;
const jpgFile = {filnavn: "test1.jpg", file: new Blob()} as Fil;
const pdfFile = {filnavn: "test3.pdf", file: new Blob()} as Fil;

describe('Ettersendelsetest', () => {

    it('should create correct form data', () => {

        const formData: FormData = opprettFormDataMedVedlegg([pngFile, jpgFile, pdfFile]);
        expect(formData).toBeDefined();

        const formDataEntryValues: FormDataEntryValue[] = formData.getAll("files");
        expect(formDataEntryValues).toBeDefined();
        expect(formDataEntryValues.length).toBe(4);

        expect((formDataEntryValues[0] as File).name).toBeDefined();
        expect((formDataEntryValues[0] as File).name).toBe("metadata.json");

        expect((formDataEntryValues[1] as File).name).toBeDefined();
        expect((formDataEntryValues[1] as File).name).toBe(pngFile.filnavn);

        expect((formDataEntryValues[2] as File).name).toBeDefined();
        expect((formDataEntryValues[2] as File).name).toBe(jpgFile.filnavn);

        expect((formDataEntryValues[3] as File).name).toBeDefined();
        expect((formDataEntryValues[3] as File).name).toBe(pdfFile.filnavn);

        const metadataFilesBuffer = formDataEntryValues[0]["_buffer"];
        const metadataTestBuffer = getMetadataBuffer([pngFile, jpgFile, pdfFile]);

        expect(metadataFilesBuffer.toString()).toBe(metadataTestBuffer.toString());
    });
});

const getMetadataBuffer = (filer: Fil[]) => {
    const formData = new FormData();
    const metadataJson = genererMetatadataJson(filer);
    const metadataBlob = new Blob([metadataJson], {type: 'application/json'});
    formData.append("test", metadataBlob, "test");
    return formData.getAll("test")[0]["_buffer"];
};
