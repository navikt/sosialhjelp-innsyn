import {getRedirectUrl} from "./Linkside";

//http://localhost:3008/sosialhjelp/mock-alt/login?redirect=http://localhost:3000/sosialhjelp/innsyn/link?goto=/sosialhjelp/innsyn%26login_id=azuread_authentication_error

describe("getRedirectUrl", () => {
    it("getRedirectUrl should return correct url after login", () => {
        expect(getRedirectUrl("?goto=/sosialhjelp/innsyn/link&login_id=idporten_authentication_error")).toEqual("/");
    });

    it("getRedirectUrl should return correct url without any parameters", () => {
        expect(getRedirectUrl("")).toEqual("/");
    });
});
