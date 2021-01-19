import {getOriginAwareHeaders, REST_STATUS, skalViseLastestripe} from "./restUtils";

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

    it("should not include Authorization or istio-headers in prod", () => {
        let headers = getOriginAwareHeaders("https://www.nav.no");
        expect(headers.has("Authorization")).toBeFalsy();
        expect(headers.has("X-B3-TraceId")).toBeFalsy();
        expect(headers.has("X-B3-SpanId")).toBeFalsy();

        headers = getOriginAwareHeaders("https://www.nav.no", "multipart/form-data");
        expect(headers.has("Authorization")).toBeFalsy();
        expect(headers.has("X-B3-TraceId")).toBeFalsy();
        expect(headers.has("X-B3-SpanId")).toBeFalsy();
    });

    it("labs and dev-gcp should contain Authorization and istio-headers", () => {
        let headers = getOriginAwareHeaders("https://sosialhjelp-innsyn-gcp.dev.nav.no");
        containsAllHeaders(headers);

        headers = getOriginAwareHeaders("https://sosialhjelp-innsyn.labs.nais.io");
        containsAllHeaders(headers);

        headers = getOriginAwareHeaders("http://digisos.labs.nais.io/");
        containsAllHeaders(headers);
    });

    const containsAllHeaders = (headers: Headers) => {
        expect(headers.has("Authorization")).toBeTruthy();
        expect(headers.has("X-B3-TraceId")).toBeTruthy();
        expect(headers.has("X-B3-SpanId")).toBeTruthy();
        expect(headers.has("Accept")).toBeTruthy();
        expect(headers.has("Nav-Call-Id")).toBeTruthy();
        expect(headers.has("Content-Type")).toBeTruthy();
    };
});
