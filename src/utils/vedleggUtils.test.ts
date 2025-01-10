import { containsIllegalCharacters, hentFileExtension } from "./vedleggUtils";

describe("VedleggUtilsTest", () => {
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
