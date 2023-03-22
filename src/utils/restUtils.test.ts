import {getOriginAwareHeaders} from "./restUtils";

describe("getOriginAwareHeaders", () => {
    it("should use callId from parameters if set", () => {
        const callId = "callId";
        const headers = getOriginAwareHeaders("https://www.nav.no", undefined, callId);
        expect(headers.get("Nav-Call-Id")).toBe(callId);
    });

    it("should include Content-Type, when not multipart-request", () => {
        const headers = getOriginAwareHeaders("https://www.nav.no");
        expect(headers.has("Content-Type")).toBeTruthy();
    });

    it("should not include Content-Type, when multipart-request", () => {
        const headers = getOriginAwareHeaders("https://www.nav.no", "multipart/form-data");
        expect(headers.has("Content-Type")).toBeFalsy();
    });

    it("should include Accept and Nav-Call-Id, idependent of contentType", () => {
        let headers = getOriginAwareHeaders("https://www.nav.no", "multipart/form-data");
        expect(headers.has("Accept")).toBeTruthy();
        expect(headers.has("Nav-Call-Id")).toBeTruthy();

        headers = getOriginAwareHeaders("https://www.nav.no");
        expect(headers.has("Accept")).toBeTruthy();
        expect(headers.has("Nav-Call-Id")).toBeTruthy();
    });

    it("should not include Authorization in prod", () => {
        let headers = getOriginAwareHeaders("https://www.nav.no");
        expect(headers.has("Authorization")).toBeFalsy();

        headers = getOriginAwareHeaders("https://www.nav.no", "multipart/form-data");
        expect(headers.has("Authorization")).toBeFalsy();
    });
});
