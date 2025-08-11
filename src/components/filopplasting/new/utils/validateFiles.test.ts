import { describe, it, expect } from "vitest";

import { maxFileSize, maxCombinedFileSize, maxFileCount, allowedFileTypes } from "../consts";
import { Feil } from "../types";

import { containsIllegalCharacters, isAcceptedFileType, validateFile, getOuterErrors } from "./validateFiles";

describe("validateFiles", () => {
    describe("containsIllegalCharacters", () => {
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

    describe("isAcceptedFileType", () => {
        it("should return true for accepted file types", () => {
            const pdfFile = new File(["content"], "document.pdf", { type: "application/pdf" });
            const pngFile = new File(["content"], "image.png", { type: "image/png" });
            const jpegFile = new File(["content"], "image.jpeg", { type: "image/jpeg" });

            expect(isAcceptedFileType(pdfFile, allowedFileTypes)).toBe(true);
            expect(isAcceptedFileType(pngFile, allowedFileTypes)).toBe(true);
            expect(isAcceptedFileType(jpegFile, allowedFileTypes)).toBe(true);
        });

        it("should return false for unaccepted file types", () => {
            const file = new File(["content"], "image.xlsx", { type: "image/xlsx" });
            expect(isAcceptedFileType(file, allowedFileTypes)).toBe(false);
        });

        it("should return true if no accepted types are specified", () => {
            const file = new File(["content"], "image.png", { type: "image/png" });
            expect(isAcceptedFileType(file, undefined)).toBe(true);
        });
    });

    describe("validateFile", () => {
        it("should return FILE_TOO_LARGE for files exceeding max size", () => {
            const file = new File(["content"], "largefile.pdf", { type: "application/pdf" });
            Object.defineProperty(file, "size", { value: maxFileSize + 1 }); // Mock file size
            expect(validateFile(file)).toBe(Feil.FILE_TOO_LARGE);
        });

        it("should return ILLEGAL_FILE_NAME for files with illegal characters", () => {
            const file = new File(["content"], "file*name.pdf", { type: "application/pdf" });
            expect(validateFile(file)).toBe(Feil.ILLEGAL_FILE_NAME);
        });

        it("should return ILLEGAL_FILE_TYPE for files with unaccepted types", () => {
            const xclsFile = new File(["content"], "table.xlsx", { type: "table.xlsx" });
            const dmgFile = new File(["content"], "table.dmg", { type: "table.dmg" });
            expect(validateFile(xclsFile)).toBe(Feil.ILLEGAL_FILE_TYPE);
            expect(validateFile(dmgFile)).toBe(Feil.ILLEGAL_FILE_TYPE);
        });

        it("should return null for valid files", () => {
            const file = new File(["content"], "document.pdf", { type: "application/pdf" });
            Object.defineProperty(file, "size", { value: maxFileSize - 1 }); // Mock file size
            expect(validateFile(file)).toBe(null);
        });
    });

    describe("getOuterErrors", () => {
        it("should return COMBINED_TOO_LARGE if total file size exceeds max combined size", () => {
            const files = [
                { file: new File(["content"], "file1.pdf", { type: "application/pdf" }), uuid: "1" },
                { file: new File(["content"], "file2.pdf", { type: "application/pdf" }), uuid: "2" },
            ];
            Object.defineProperty(files[0].file, "size", { value: maxCombinedFileSize / 2 });
            Object.defineProperty(files[1].file, "size", { value: maxCombinedFileSize / 2 + 1 });

            const errors = getOuterErrors(files);
            expect(errors).toHaveLength(1);
            expect(errors[0].feil).toBe(Feil.COMBINED_TOO_LARGE);
        });

        it("should return TOO_MANY_FILES if file count exceeds max file count", () => {
            const files = Array.from({ length: maxFileCount + 1 }, (_, i) => ({
                file: new File(["content"], `file${i}.pdf`, { type: "application/pdf" }),
                uuid: i.toString(),
            }));

            const errors = getOuterErrors(files);
            expect(errors).toHaveLength(1);
            expect(errors[0].feil).toBe(Feil.TOO_MANY_FILES);
        });

        it("should return no errors for valid file count and size", () => {
            const files = [
                { file: new File(["content"], "file1.pdf", { type: "application/pdf" }), uuid: "1" },
                { file: new File(["content"], "file2.pdf", { type: "application/pdf" }), uuid: "2" },
            ];
            Object.defineProperty(files[0].file, "size", { value: maxCombinedFileSize / 2 });
            Object.defineProperty(files[1].file, "size", { value: maxCombinedFileSize / 2 });

            const errors = getOuterErrors(files);
            expect(errors).toHaveLength(0);
        });
    });
});
