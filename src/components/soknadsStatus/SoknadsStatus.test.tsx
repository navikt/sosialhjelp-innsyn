import {hentSaksStatusTittel} from "./SoknadsStatus";
import {SaksStatus} from "../../redux/innsynsdata/innsynsdataReducer";

describe("SoknadStatusTest", () => {
    it("hentSaksStatusTittel should return correct title key for UNDER_BEHANDLING", () => {
        expect(hentSaksStatusTittel(SaksStatus.UNDER_BEHANDLING)).toEqual("saksStatus.under_behandling");
    });
    it("hentSaksStatusTittel should return correct title key for FERDIG_BEHANDLET", () => {
        expect(hentSaksStatusTittel(SaksStatus.FERDIGBEHANDLET)).toEqual("saksStatus.ferdig_behandlet");
    });
    it("hentSaksStatusTittel should have same title for IKKE_INNSYN and BEHANDLES_IKKE", () => {
        expect(hentSaksStatusTittel(SaksStatus.IKKE_INNSYN)).toEqual(hentSaksStatusTittel(SaksStatus.BEHANDLES_IKKE));
    });
});
