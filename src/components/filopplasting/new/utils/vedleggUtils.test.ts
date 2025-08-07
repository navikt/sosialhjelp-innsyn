import { expect, describe, it } from "vitest";

import { containsIllegalCharacters } from "./validateFiles";

describe("VedleggUtilsTest", () => {
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
