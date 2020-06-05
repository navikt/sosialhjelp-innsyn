import {KommuneResponse} from "../redux/innsynsdata/innsynsdataReducer";
import {
    isKommuneBergen,
    isKommuneInfoFetched,
    isKommuneMedInnsynUtenBergen,
    isKommuneUtenInnsynUtenBergen,
} from "./saksStatusUtils";
import {REST_STATUS} from "../utils/restUtils";

describe("Hotjar-trigger utils", () => {
    it("before fetching kommuneResponse, all hotjartriggers should be disabled", () => {
        const initialKommuneResponse: KommuneResponse = {
            erInnsynDeaktivert: false,
            erInnsynMidlertidigDeaktivert: false,
            erInnsendingEttersendelseDeaktivert: false,
            erInnsendingEttersendelseMidlertidigDeaktivert: false,
            tidspunkt: null,
            kommunenummer: null,
        };

        // INITIALISERT
        expect(isKommuneBergen(initialKommuneResponse)).toBe(false);
        expect(isKommuneInfoFetched(REST_STATUS.INITIALISERT)).toBe(false);
        expect(isKommuneMedInnsynUtenBergen(initialKommuneResponse, REST_STATUS.INITIALISERT)).toBe(false);
        expect(isKommuneUtenInnsynUtenBergen(initialKommuneResponse, REST_STATUS.INITIALISERT)).toBe(false);

        // PENDING
        expect(isKommuneBergen(initialKommuneResponse)).toBe(false);
        expect(isKommuneInfoFetched(REST_STATUS.PENDING)).toBe(false);
        expect(isKommuneMedInnsynUtenBergen(initialKommuneResponse, REST_STATUS.PENDING)).toBe(false);
        expect(isKommuneUtenInnsynUtenBergen(initialKommuneResponse, REST_STATUS.PENDING)).toBe(false);
    });

    it("failing kommuneResponse should trigger hotjar utenInnsyn", () => {
        const initialKommuneResponse: KommuneResponse = {
            erInnsynDeaktivert: false,
            erInnsynMidlertidigDeaktivert: false,
            erInnsendingEttersendelseDeaktivert: false,
            erInnsendingEttersendelseMidlertidigDeaktivert: false,
            tidspunkt: null,
            kommunenummer: null,
        };

        // FEILET
        expect(isKommuneBergen(initialKommuneResponse)).toBe(false);
        expect(isKommuneInfoFetched(REST_STATUS.FEILET)).toBe(true);
        expect(isKommuneMedInnsynUtenBergen(initialKommuneResponse, REST_STATUS.FEILET)).toBe(false);
        expect(isKommuneUtenInnsynUtenBergen(initialKommuneResponse, REST_STATUS.FEILET)).toBe(true);

        // UNAUTHORIZED
        expect(isKommuneBergen(initialKommuneResponse)).toBe(false);
        expect(isKommuneInfoFetched(REST_STATUS.UNAUTHORIZED)).toBe(true);
        expect(isKommuneMedInnsynUtenBergen(initialKommuneResponse, REST_STATUS.UNAUTHORIZED)).toBe(false);
        expect(isKommuneUtenInnsynUtenBergen(initialKommuneResponse, REST_STATUS.UNAUTHORIZED)).toBe(true);

        // SERVICE_UNAVAILABLE
        expect(isKommuneBergen(initialKommuneResponse)).toBe(false);
        expect(isKommuneInfoFetched(REST_STATUS.SERVICE_UNAVAILABLE)).toBe(true);
        expect(isKommuneMedInnsynUtenBergen(initialKommuneResponse, REST_STATUS.SERVICE_UNAVAILABLE)).toBe(false);
        expect(isKommuneUtenInnsynUtenBergen(initialKommuneResponse, REST_STATUS.SERVICE_UNAVAILABLE)).toBe(true);
    });

    it("kommunenummer 4601 should trigger hotjar for Bergen", () => {
        const kommuneResponseBergenAktivert: KommuneResponse = {
            erInnsynDeaktivert: false,
            erInnsynMidlertidigDeaktivert: false,
            erInnsendingEttersendelseDeaktivert: false,
            erInnsendingEttersendelseMidlertidigDeaktivert: false,
            tidspunkt: null,
            kommunenummer: "4601",
        };
        const kommuneResponseBergenDeaktivert: KommuneResponse = {
            erInnsynDeaktivert: true,
            erInnsynMidlertidigDeaktivert: false,
            erInnsendingEttersendelseDeaktivert: false,
            erInnsendingEttersendelseMidlertidigDeaktivert: false,
            tidspunkt: null,
            kommunenummer: "4601",
        };
        const kommuneRestStatus: REST_STATUS = REST_STATUS.OK;

        expect(isKommuneBergen(kommuneResponseBergenAktivert)).toBe(true);
        expect(isKommuneInfoFetched(kommuneRestStatus)).toBe(true);
        expect(isKommuneMedInnsynUtenBergen(kommuneResponseBergenAktivert, kommuneRestStatus)).toBe(false);
        expect(isKommuneUtenInnsynUtenBergen(kommuneResponseBergenAktivert, kommuneRestStatus)).toBe(false);

        expect(isKommuneBergen(kommuneResponseBergenDeaktivert)).toBe(true);
        expect(isKommuneInfoFetched(kommuneRestStatus)).toBe(true);
        expect(isKommuneMedInnsynUtenBergen(kommuneResponseBergenDeaktivert, kommuneRestStatus)).toBe(false);
        expect(isKommuneUtenInnsynUtenBergen(kommuneResponseBergenDeaktivert, kommuneRestStatus)).toBe(false);
    });

    it("deaktivert innsyn (and not Bergen), should trigger hotjar utenInnsyn", () => {
        const kommuneResponse: KommuneResponse = {
            erInnsynDeaktivert: true,
            erInnsynMidlertidigDeaktivert: false,
            erInnsendingEttersendelseDeaktivert: false,
            erInnsendingEttersendelseMidlertidigDeaktivert: false,
            tidspunkt: null,
            kommunenummer: "0001",
        };

        expect(isKommuneBergen(kommuneResponse)).toBe(false);
        expect(isKommuneInfoFetched(REST_STATUS.OK)).toBe(true);
        expect(isKommuneMedInnsynUtenBergen(kommuneResponse, REST_STATUS.OK)).toBe(false);
        expect(isKommuneUtenInnsynUtenBergen(kommuneResponse, REST_STATUS.OK)).toBe(true);
    });

    it("aktivert innsyn (and not Bergen), should trigger hotjar medInnsyn", () => {
        const kommuneResponse: KommuneResponse = {
            erInnsynDeaktivert: false,
            erInnsynMidlertidigDeaktivert: false,
            erInnsendingEttersendelseDeaktivert: false,
            erInnsendingEttersendelseMidlertidigDeaktivert: false,
            tidspunkt: null,
            kommunenummer: "0001",
        };

        expect(isKommuneBergen(kommuneResponse)).toBe(false);
        expect(isKommuneInfoFetched(REST_STATUS.OK)).toBe(true);
        expect(isKommuneMedInnsynUtenBergen(kommuneResponse, REST_STATUS.OK)).toBe(true);
        expect(isKommuneUtenInnsynUtenBergen(kommuneResponse, REST_STATUS.OK)).toBe(false);
    });
});
