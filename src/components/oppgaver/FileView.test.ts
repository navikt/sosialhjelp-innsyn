import {legalFileExtension} from "../../utils/vedleggUtils";

describe("FileView", () => {
    it("should check file extension", () => {
        const legalNames = [
            "spike.jpg",
            "spike.JPG",
            "spike.JPEG",
            "spike.jpeg",
            "spike.png",
            "spike.PNG",
            "spike.pdf",
            "spike.PDF",
        ];
        legalNames.forEach((filename: string) => {
            expect(legalFileExtension(filename)).toBe(true);
        });
        const illegalNames = ["spike.gif", "spike.GIF"];
        illegalNames.forEach((filename: string) => {
            expect(legalFileExtension(filename)).toBe(false);
        });
        expect(1).toBe(1);
    });
});
