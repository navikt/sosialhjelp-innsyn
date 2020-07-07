import {REST_STATUS, skalViseLastestripe} from "./restUtils";

describe("RestUtilsTest", () => {
    it("should show lastestripe for REST_STATUS.PENDING", () => {
        expect(skalViseLastestripe(REST_STATUS.PENDING)).toBe(true);
    });
    it("should show lastestripe for REST_STATUS.INITIALISERT", () => {
        expect(skalViseLastestripe(REST_STATUS.INITIALISERT)).toBe(true);
    });
    it("should show lastestripe for REST_STATUS.FEILET", () => {
        expect(skalViseLastestripe(REST_STATUS.FEILET)).toBe(true);
    });
    it("should not show lastestripe for REST_STATUS.OK", () => {
        expect(skalViseLastestripe(REST_STATUS.OK)).toBe(false);
    });
});
