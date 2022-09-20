import {getBaseUrl, isLocalhost, isDevSbs, isDev} from "./restUtils";

const localhostOrigins = [
    "http://localhost:3003/sosialhjelp/innsyn",
    "http://localhost:3000/sosialhjelp/innsyn",
    "http://localhost:3003",
    "http://localhost:3000",
    "localhost:3003",
    "localhost:3000",
    "localhost",
];

const devSbs_origins = [
    "https://sosialhjelp-innsyn.dev.nav.no/sosialhjelp/innsyn",
    "https://sosialhjelp-innsyn.dev.nav.no",
];

const devSbs_devNavnoOrigins = ["https://www-q0.dev.nav.no/sosialhjelp/innsyn", "https://www-q0.dev.nav.no"];

const devOrigins = ["https://digisos.dev.nav.no/sosialhjelp/innsyn", "https://digisos.dev.nav.no"];

const mockOrigins = ["https://digisos.ekstern.dev.nav.no/sosialhjelp/innsyn", "https://digisos.ekstern.dev.nav.no"];

const prodSbsOrigins = [
    "https://sosialhjelp-innsyn.prod-sbs.nais.io/sosialhjelp/innsyn",
    "https://sosialhjelp-innsyn.prod-sbs.nais.io",
];
const prodNavnoOrigins = ["https://www.nav.no/sosialhjelp/innsyn", "https://www.nav.no"];

const unknownOrigins = [
    "https://tull.no",
    "https://www.vg.no",
    "https://www.nav.no",
    "https://sosialhjelp-modig.nais.adeo.no",
];

describe("getBaseUrl", () => {
    it("should return correct backend-url", () => {
        validateGetBaseUrl(
            localhostOrigins,
            "http://localhost:8989/sosialhjelp/mock-alt-api/login-api/sosialhjelp/innsyn-api/api/v1"
        );
        // validateGetBaseUrl(devSbs_devNavnoOrigins, "https://www-q0.dev.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
        // validateGetBaseUrl(
        //     devSbs_origins,
        //     "https://sosialhjelp-login-api.dev.nav.no/sosialhjelp/login-api/innsyn-api/api/v1"
        // );
        validateGetBaseUrl(devOrigins, "https://digisos.dev.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
        validateGetBaseUrl(
            mockOrigins,
            "https://digisos.ekstern.dev.nav.no/sosialhjelp/mock-alt-api/login-api/sosialhjelp/innsyn-api/api/v1"
        );
        validateGetBaseUrl(prodSbsOrigins, "https://www.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
        validateGetBaseUrl(prodNavnoOrigins, "https://www.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
    });

    it("should default to prod when url is unknown correct backend-url", () => {
        validateGetBaseUrl(unknownOrigins, "https://www.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
    });

    function validateGetBaseUrl(origins: string[], expected: string) {
        origins.forEach((origin) => {
            expect(getBaseUrl(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});

describe("isDev", () => {
    it("should return true for localhost", () => {
        validateIsDev(localhostOrigins, true);
    });

    it("should return false for prod", () => {
        validateIsDev(prodSbsOrigins, false);
        validateIsDev(prodNavnoOrigins, false);
    });

    it("should return false for other", () => {
        validateIsDev(devSbs_origins, false);
        validateIsDev(devSbs_devNavnoOrigins, false);

        validateIsDev(devOrigins, false);
        validateIsDev(mockOrigins, false);

        validateIsDev(unknownOrigins, false);
    });

    function validateIsDev(origins: string[], expected: boolean) {
        origins.forEach((origin) => {
            expect(isLocalhost(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});

describe("isDevSbs", () => {
    it("should return true for dev-sbs", () => {
        validateIsDevSbs(devSbs_origins, true);
        validateIsDevSbs(devSbs_devNavnoOrigins, true);
    });

    it("should return false for prod", () => {
        validateIsDevSbs(prodSbsOrigins, false);
        validateIsDevSbs(prodNavnoOrigins, false);
    });

    it("should return false for other", () => {
        validateIsDevSbs(localhostOrigins, false);

        validateIsDevSbs(devOrigins, false);
        validateIsDevSbs(mockOrigins, false);

        validateIsDevSbs(unknownOrigins, false);
    });

    function validateIsDevSbs(origins: string[], expected: boolean) {
        origins.forEach((origin) => {
            expect(isDevSbs(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});

describe("isDev", () => {
    it("should return true for dev-gcp with proxy", () => {
        validateIsDev(devOrigins, true);
    });

    it("should return false for prod", () => {
        validateIsDev(prodSbsOrigins, false);
        validateIsDev(prodNavnoOrigins, false);
    });

    it("should return false for other", () => {
        validateIsDev(localhostOrigins, false);

        validateIsDev(devSbs_origins, false);
        validateIsDev(devSbs_devNavnoOrigins, false);

        validateIsDev(mockOrigins, false);

        validateIsDev(unknownOrigins, false);
    });

    function validateIsDev(origins: string[], expected: boolean) {
        origins.forEach((origin) => {
            expect(isDev(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});
