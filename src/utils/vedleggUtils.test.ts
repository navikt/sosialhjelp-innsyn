import {Fil, Oppgave, OppgaveElement} from "../redux/innsynsdata/innsynsdataReducer";
import {
    opprettFormDataMedVedleggFraFiler,
    opprettFormDataMedVedleggFraOppgaver,
    containsUlovligeTegn,
    hentFileExtension,
} from "./vedleggUtils";

const pngFile = {filnavn: "test0.png", file: new Blob()} as Fil;
const jpgFile = {filnavn: "test1.jpg", file: new Blob()} as Fil;
const pdfFile = {filnavn: "test3.pdf", file: new Blob()} as Fil;
const emptyFile = {filnavn: "test3.pdf", file: undefined} as Fil;

const oppgave = {
    innsendelsesfrist: "2019-11-11",
    oppgaveElementer: [
        {
            dokumenttype: "dokumenttype1",
            tilleggsinformasjon: "tilleggsinformasjon1",
            erFraInnsyn: true,
            filer: [pngFile, jpgFile],
        } as OppgaveElement,
        {
            dokumenttype: "dokumenttype2",
            tilleggsinformasjon: "tilleggsinformasjon2",
            erFraInnsyn: true,
            filer: [pdfFile],
        } as OppgaveElement,
        {
            dokumenttype: "dokumenttype3",
            tilleggsinformasjon: "tilleggsinformasjon3",
            erFraInnsyn: true,
            filer: [jpgFile, jpgFile],
        } as OppgaveElement,
    ],
} as Oppgave;
const expectedOppgaverMetadata = JSON.stringify(
    [
        {
            type: oppgave.oppgaveElementer[0].dokumenttype,
            tilleggsinfo: oppgave.oppgaveElementer[0].tilleggsinformasjon,
            innsendelsesfrist: oppgave.innsendelsesfrist,
            filer: [{filnavn: pngFile.filnavn}, {filnavn: jpgFile.filnavn}],
        },
        {
            type: oppgave.oppgaveElementer[1].dokumenttype,
            tilleggsinfo: oppgave.oppgaveElementer[1].tilleggsinformasjon,
            innsendelsesfrist: oppgave.innsendelsesfrist,
            filer: [{filnavn: pdfFile.filnavn}],
        },
        {
            type: oppgave.oppgaveElementer[2].dokumenttype,
            tilleggsinfo: oppgave.oppgaveElementer[2].tilleggsinformasjon,
            innsendelsesfrist: oppgave.innsendelsesfrist,
            filer: [{filnavn: jpgFile.filnavn}, {filnavn: jpgFile.filnavn}],
        },
    ],
    null,
    8
);

const expectedEttersendelseMetadata = JSON.stringify(
    [
        {
            type: "annet",
            tilleggsinfo: "annet",
            filer: [{filnavn: pngFile.filnavn}, {filnavn: jpgFile.filnavn}, {filnavn: pdfFile.filnavn}],
        },
    ],
    null,
    8
);

describe("VedleggUtilsTest", () => {
    it("should create correct form and meta data for oppgaver", () => {
        const formData: FormData = opprettFormDataMedVedleggFraOppgaver(oppgave);
        expect(formData).toBeDefined();

        const formDataEntryValues: FormDataEntryValue[] = formData.getAll("files");
        expect(formDataEntryValues).toBeDefined();
        expect(formDataEntryValues.length).toBe(6);

        [
            {file: formDataEntryValues[0], filnavn: "metadata.json"},
            {file: formDataEntryValues[1], filnavn: pngFile.filnavn},
            {file: formDataEntryValues[2], filnavn: jpgFile.filnavn},
            {file: formDataEntryValues[3], filnavn: pdfFile.filnavn},
            {file: formDataEntryValues[4], filnavn: jpgFile.filnavn},
            {file: formDataEntryValues[5], filnavn: jpgFile.filnavn},
        ].forEach((value: {file: FormDataEntryValue; filnavn: string}) => {
            const file = value.file as File;
            expect(file).toBeDefined();
            expect(file.name).toBe(value.filnavn);
        });

        const metadataFile = formDataEntryValues[0] as File;
        // @ts-ignore
        const actualMetadata = metadataFile["_buffer"].toString();
        expect(actualMetadata).toBe(expectedOppgaverMetadata);
    });

    it("should create correct form and meta data for ettersendelse", () => {
        const formData: FormData = opprettFormDataMedVedleggFraFiler([pngFile, jpgFile, pdfFile]);
        expect(formData).toBeDefined();

        const formDataEntryValues: FormDataEntryValue[] = formData.getAll("files");
        expect(formDataEntryValues).toBeDefined();
        expect(formDataEntryValues.length).toBe(4);

        [
            {file: formDataEntryValues[0], filnavn: "metadata.json"},
            {file: formDataEntryValues[1], filnavn: pngFile.filnavn},
            {file: formDataEntryValues[2], filnavn: jpgFile.filnavn},
            {file: formDataEntryValues[3], filnavn: pdfFile.filnavn},
        ].forEach((value: {file: FormDataEntryValue; filnavn: string}) => {
            const file = value.file as File;
            expect(file).toBeDefined();
            expect(file.name).toBe(value.filnavn);
        });

        const metadataFile = formDataEntryValues[0] as File;
        // @ts-ignore
        const actualMetadata = metadataFile["_buffer"].toString();
        expect(actualMetadata).toBe(expectedEttersendelseMetadata);
    });

    it("should log error for empty file file object ettersendelse", () => {
        const formDataMedTomFil: FormData = opprettFormDataMedVedleggFraFiler([pngFile, jpgFile, emptyFile]);
        expect(formDataMedTomFil).toBeDefined();

        const formDataMedTomFilEntryValues: FormDataEntryValue[] = formDataMedTomFil.getAll("files");
        expect(formDataMedTomFilEntryValues).toBeDefined();
        expect(formDataMedTomFilEntryValues.length).toBe(3);

        [
            {file: formDataMedTomFilEntryValues[0], filnavn: "metadata.json"},
            {file: formDataMedTomFilEntryValues[1], filnavn: pngFile.filnavn},
            {file: formDataMedTomFilEntryValues[2], filnavn: jpgFile.filnavn},
        ].forEach((value: {file: FormDataEntryValue; filnavn: string}) => {
            const file = value.file as File;
            expect(file).toBeDefined();
            expect(file.name).toBe(value.filnavn);
        });
    });

    it("should find fileetternavn", () => {
        const filename = "jpegfil.jpg";
        expect(hentFileExtension(filename)).toBe("jpg");
    });

    it("should find fileetternavn2", () => {
        const filename = "wordsfil.docx";
        expect(hentFileExtension(filename)).toBe("docx");
    });

    it("should not find fileetternavn when no dot", () => {
        const filename = "gyldigfilnavn";
        expect(hentFileExtension(filename)).toBe("ukjent");
    });

    it("should not find fileetternavn when many and early dots", () => {
        const manydots = "gyldigfilnavn.med.flere.punktummer";
        expect(hentFileExtension(manydots)).toBe("ukjent");
    });

    it("should validate filenames", () => {
        const filename = "gyldigfilnavn.jpg";
        expect(containsUlovligeTegn(filename)).toBe(false);
    });

    it("should properly validate norwegian characters in filenames", () => {
        const filename = "æøå.pdf";
        expect(containsUlovligeTegn(filename)).toBe(false);
    });

    it("should reject illegal characters in filenames", () => {
        const filename = "[abc]&.pdf";
        expect(containsUlovligeTegn(filename)).toBe(true);
    });

    it("should properly validate decomposed filename", () => {
        const filename = "a\u030AA\u030A.pdf";
        expect(containsUlovligeTegn(filename)).toBe(false);
    });

    it("should reject ring modifier key", () => {
        const filename = "\u030A.pdf";
        expect(containsUlovligeTegn(filename)).toBe(true);
    });
});
