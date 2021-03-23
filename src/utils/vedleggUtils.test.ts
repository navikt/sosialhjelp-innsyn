import {Fil, DokumentasjonEtterspurt, DokumentasjonEtterspurtElement} from "../redux/innsynsdata/innsynsdataReducer";
import {
    containsIllegalCharacters,
    HendelseTypeEnum,
    hentFileExtension,
    generateMetadataFromAndreVedlegg,
    generateMetadataFromOppgaver,
    opprettFormDataMedVedleggFraOppgaver,
    opprettFormDataMedVedleggFraFiler,
} from "./vedleggUtils";

const pngFile = {filnavn: "test0.png", file: new Blob()} as Fil;
const jpgFile = {filnavn: "test1.jpg", file: new Blob()} as Fil;
const pdfFile = {filnavn: "test3.pdf", file: new Blob()} as Fil;
const emptyFile = {filnavn: "test3.pdf", file: undefined} as Fil;

const oppgave = {
    innsendelsesfrist: "2019-11-11",
    oppgaveElementer: [
        {
            tittel: "dokumenttype1",
            beskrivelse: "tilleggsinformasjon1",
            hendelsetype: HendelseTypeEnum.DOKUMENTASJON_ETTERSPURT,
            erFraInnsyn: true,
            filer: [pngFile, jpgFile],
        } as DokumentasjonEtterspurtElement,
        {
            tittel: "dokumenttype2",
            beskrivelse: "tilleggsinformasjon2",
            hendelsetype: HendelseTypeEnum.DOKUMENTASJONKRAV,
            hendelsereferanse: "dokkravref-1234",
            erFraInnsyn: true,
            filer: [pdfFile],
        } as DokumentasjonEtterspurtElement,
        {
            tittel: "dokumenttype3",
            beskrivelse: "tilleggsinformasjon3",
            erFraInnsyn: true,
            filer: [jpgFile, jpgFile],
        } as DokumentasjonEtterspurtElement,
    ],
} as DokumentasjonEtterspurt;

const expectedOppgaverMetadata = [
    {
        type: oppgave.oppgaveElementer[0].tittel,
        tilleggsinfo: oppgave.oppgaveElementer[0].beskrivelse,
        innsendelsesfrist: oppgave.innsendelsesfrist,
        hendelsetype: "dokumentasjonEtterspurt",
        filer: [{filnavn: pngFile.filnavn}, {filnavn: jpgFile.filnavn}],
    },
    {
        type: oppgave.oppgaveElementer[1].tittel,
        tilleggsinfo: oppgave.oppgaveElementer[1].beskrivelse,
        innsendelsesfrist: oppgave.innsendelsesfrist,
        hendelsetype: "dokumentasjonkrav",
        hendelsereferanse: oppgave.oppgaveElementer[1].hendelsereferanse,
        filer: [{filnavn: pdfFile.filnavn}],
    },
    {
        type: oppgave.oppgaveElementer[2].tittel,
        tilleggsinfo: oppgave.oppgaveElementer[2].beskrivelse,
        innsendelsesfrist: oppgave.innsendelsesfrist,
        filer: [{filnavn: jpgFile.filnavn}, {filnavn: jpgFile.filnavn}],
    },
];

const expectedEttersendelseMetadata = [
    {
        type: "annet",
        tilleggsinfo: "annet",
        hendelsetype: "bruker",
        filer: [{filnavn: pngFile.filnavn}, {filnavn: jpgFile.filnavn}, {filnavn: pdfFile.filnavn}],
    },
];

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

        const metadata = generateMetadataFromOppgaver(oppgave);
        expect(metadata).toMatchObject(expectedOppgaverMetadata);
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

        const metadata = generateMetadataFromAndreVedlegg([pngFile, jpgFile, pdfFile]);
        expect(metadata).toMatchObject(expectedEttersendelseMetadata);
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

    it("should find file extension", () => {
        const filename = "jpegfil.jpg";
        expect(hentFileExtension(filename)).toBe("jpg");
    });

    it("should find file extension2", () => {
        const filename = "wordsfil.docx";
        expect(hentFileExtension(filename)).toBe("docx");
    });

    it("should not find file extension when no dot", () => {
        const filename = "gyldigfilnavn";
        expect(hentFileExtension(filename)).toBe("ukjent");
    });

    it("should not find file extension when many and early dots", () => {
        const manydots = "gyldigfilnavn.med.flere.punktummer";
        expect(hentFileExtension(manydots)).toBe("ukjent");
    });

    it("should validate filenames", () => {
        const filename = "gyldigfilnavn.jpg";
        expect(containsIllegalCharacters(filename)).toBe(false);
    });

    it("should properly validate norwegian characters in filenames", () => {
        const filename = "æøå.pdf";
        expect(containsIllegalCharacters(filename)).toBe(false);
    });

    it("should reject illegal characters in filenames", () => {
        const filename = "[abc]&.pdf";
        expect(containsIllegalCharacters(filename)).toBe(true);
    });

    it("should properly validate decomposed filename", () => {
        const filename = "a\u030AA\u030A.pdf";
        expect(containsIllegalCharacters(filename)).toBe(false);
    });

    it("should reject ring modifier key", () => {
        const filename = "\u030A.pdf";
        expect(containsIllegalCharacters(filename)).toBe(true);
    });
});
