import {deleteReferenceFromDokumentasjonkravFiler, DokumentasjonKravFiler} from "./DokumentasjonKravView";

describe("deleteReferenceFromDokumentasjonkravFiler", () => {
    it("sletter 1 referanse fra objekt med 1 referanse", () => {
        const dokumentasjonkravFiler: DokumentasjonKravFiler = {
            "123": [],
        };
        const updatedObject = deleteReferenceFromDokumentasjonkravFiler(dokumentasjonkravFiler, "123");
        expect(updatedObject).toStrictEqual({});
    });
    it("sletter 1 referanse fra objekt med 2 referanser", () => {
        const dokumentasjonkravFiler: DokumentasjonKravFiler = {
            "123": [],
            "456": [],
        };
        const updatedObject = deleteReferenceFromDokumentasjonkravFiler(dokumentasjonkravFiler, "123");
        expect(updatedObject).toStrictEqual({"456": []});
    });
    it("sletter referanse fra tomt object", () => {
        const updatedObject = deleteReferenceFromDokumentasjonkravFiler({}, "123");
        expect(updatedObject).toStrictEqual({});
    });
    it("sletter referanse som ikke finnes på objekt", () => {
        const dokumentasjonkravFiler: DokumentasjonKravFiler = {
            "123": [],
        };
        const updatedObject = deleteReferenceFromDokumentasjonkravFiler(dokumentasjonkravFiler, "456");
        expect(updatedObject).toStrictEqual({"123": []});
    });
});
