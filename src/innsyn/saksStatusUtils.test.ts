import {isKommuneMedInnsyn, isKommuneUtenInnsyn} from "./saksStatusUtils";
import {SoknadsStatusEnum} from "../components/soknadsStatus/soknadsStatusUtils";
import {KommuneResponse} from "../generated/model";

describe("Hotjar-trigger utils", () => {
    const aktivertInnsynKommuneResponse: KommuneResponse = {
        erInnsynDeaktivert: false,
        erInnsynMidlertidigDeaktivert: false,
        erInnsendingEttersendelseDeaktivert: false,
        erInnsendingEttersendelseMidlertidigDeaktivert: false,
        tidspunkt: new Date(),
        kommunenummer: "0001",
    };

    const deaktivertInnsynKommuneResponse: KommuneResponse = {
        erInnsynDeaktivert: true,
        erInnsynMidlertidigDeaktivert: false,
        erInnsendingEttersendelseDeaktivert: false,
        erInnsendingEttersendelseMidlertidigDeaktivert: false,
        tidspunkt: new Date(),
        kommunenummer: "0001",
    };

    it("ingen kommunerespons, should not trigger any hotjar", () => {
        expect(isKommuneUtenInnsyn(undefined)).toBe(false);
        expect(isKommuneMedInnsyn(undefined, SoknadsStatusEnum.MOTTATT)).toBe(false);
    });

    it("deaktivert innsyn, should trigger hotjar utenInnsyn", () => {
        expect(isKommuneUtenInnsyn(deaktivertInnsynKommuneResponse)).toBe(true);
    });

    it("deaktivert innsyn, should not trigger hotjar medInnsyn", () => {
        expect(isKommuneMedInnsyn(deaktivertInnsynKommuneResponse, SoknadsStatusEnum.MOTTATT)).toBe(false);
    });

    it("aktivert innsyn, should not trigger utenInnsyn", () => {
        expect(isKommuneUtenInnsyn(aktivertInnsynKommuneResponse)).toBe(false);
    });

    it("aktivert innsyn med søknad SENDT, should not trigger medInnsyn", () => {
        expect(isKommuneMedInnsyn(aktivertInnsynKommuneResponse, SoknadsStatusEnum.SENDT)).toBe(false);
    });

    it("aktivert innsyn med søknad !SENDT, should trigger hotjar medInnsyn", () => {
        expect(isKommuneMedInnsyn(aktivertInnsynKommuneResponse, SoknadsStatusEnum.MOTTATT)).toBe(true);
        expect(isKommuneMedInnsyn(aktivertInnsynKommuneResponse, SoknadsStatusEnum.UNDER_BEHANDLING)).toBe(true);
        expect(isKommuneMedInnsyn(aktivertInnsynKommuneResponse, SoknadsStatusEnum.FERDIGBEHANDLET)).toBe(true);
        expect(isKommuneMedInnsyn(aktivertInnsynKommuneResponse, SoknadsStatusEnum.BEHANDLES_IKKE)).toBe(true);
    });
});
