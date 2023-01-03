import {getRedirectUrl} from "./Linkside";

describe("getRedirectUrl", () => {
    it("getRedirectUrl should return correct url after login", () => {
        expect(getRedirectUrl("?goto=/sosialhjelp/innsyn&login_id=idporten_authentication_error")).toEqual("/");
    });

    it("getRedirectUrl should return correct url without any parameters", () => {
        expect(getRedirectUrl("")).toEqual("/");
    });
});
