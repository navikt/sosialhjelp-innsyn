import {getRedirectUrl} from "./Linkside";

describe("getRedirectUrl", () => {
    it("hentSaksStatusTittel should return correct title key for UNDER_BEHANDLING", () => {
        expect(getRedirectUrl("?goto=/sosialhjelp/innsyn/link&login_id=idporten_authentication_error")).toEqual(
            "/innsyn/link"
        );
    });

    it("hentSaksStatusTittel should return correct title key for UNDER_BEHANDLING", () => {
        expect(getRedirectUrl("")).toEqual("");
    });
});
