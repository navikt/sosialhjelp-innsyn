import {getBaseUrl, isLocalhost, isLabs, isDevSbs, getSoknadBaseUrl, getNavUrl, isDev} from "./restUtils";

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

const labsOrigins = ["https://digisos.labs.nais.io/sosialhjelp/innsyn", "https://digisos.labs.nais.io"];

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
        validateGetBaseUrl(localhostOrigins, "http://localhost:8080/sosialhjelp/innsyn-api/api/v1");
        validateGetBaseUrl(devSbs_devNavnoOrigins, "https://www-q0.dev.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
        validateGetBaseUrl(
            devSbs_origins,
            "https://sosialhjelp-login-api.dev.nav.no/sosialhjelp/login-api/innsyn-api/api/v1"
        );
        validateGetBaseUrl(
            labsOrigins,
            "https://digisos.labs.nais.io/sosialhjelp/mock-alt-api/login-api/sosialhjelp/innsyn-api/api/v1"
        );
        validateGetBaseUrl(devOrigins, "https://digisos.dev.nav.no/sosialhjelp/innsyn-api/api/v1");
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

describe("getSoknadBaseUrl", () => {
    it("should return correct backend-url", () => {
        validateGetBaseUrl(localhostOrigins, "http://localhost:8181/sosialhjelp/soknad-api");

        validateGetBaseUrl(devSbs_devNavnoOrigins, "https://www-q0.dev.nav.no/sosialhjelp/soknad-api");
        validateGetBaseUrl(devSbs_origins, "https://sosialhjelp-soknad-api.dev.nav.no/sosialhjelp/soknad-api");

        validateGetBaseUrl(labsOrigins, "https://digisos.labs.nais.io/sosialhjelp/soknad-api");
        validateGetBaseUrl(devOrigins, "https://digisos.dev.nav.no/sosialhjelp/soknad-api");
        validateGetBaseUrl(mockOrigins, "https://digisos.ekstern.dev.nav.no/sosialhjelp/soknad-api");

        validateGetBaseUrl(prodSbsOrigins, "https://www.nav.no/sosialhjelp/soknad-api");
        validateGetBaseUrl(prodNavnoOrigins, "https://www.nav.no/sosialhjelp/soknad-api");
    });

    it("should default to prod when url is unknown correct backend-url", () => {
        validateGetBaseUrl(unknownOrigins, "https://www.nav.no/sosialhjelp/soknad-api");
    });

    function validateGetBaseUrl(origins: string[], expected: string) {
        origins.forEach((origin) => {
            expect(getSoknadBaseUrl(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});

describe("getDittNavUrl", () => {
    it("should return correct dittnav-url", () => {
        validateGetBaseUrl(localhostOrigins, "https://www.dev.nav.no/person/dittnav/");

        validateGetBaseUrl(devSbs_devNavnoOrigins, "https://www.dev.nav.no/person/dittnav/");
        validateGetBaseUrl(devSbs_origins, "https://www.dev.nav.no/person/dittnav/");

        validateGetBaseUrl(labsOrigins, "https://www.dev.nav.no/person/dittnav/");
        validateGetBaseUrl(devOrigins, "https://www.dev.nav.no/person/dittnav/");
        validateGetBaseUrl(mockOrigins, "https://www.dev.nav.no/person/dittnav/");

        validateGetBaseUrl(prodSbsOrigins, "https://www.nav.no/person/dittnav/");
        validateGetBaseUrl(prodNavnoOrigins, "https://www.nav.no/person/dittnav/");
    });

    it("should default to prod when url is unknown correct backend-url", () => {
        validateGetBaseUrl(unknownOrigins, "https://www.nav.no/person/dittnav/");
    });

    function validateGetBaseUrl(origins: string[], expected: string) {
        origins.forEach((origin) => {
            expect(getNavUrl(origin) + " for " + origin).toEqual(expected + " for " + origin);
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

        validateIsDev(labsOrigins, false);
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

        validateIsDevSbs(labsOrigins, false);
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

        validateIsDev(labsOrigins, false);
        validateIsDev(mockOrigins, false);

        validateIsDev(unknownOrigins, false);
    });

    function validateIsDev(origins: string[], expected: boolean) {
        origins.forEach((origin) => {
            expect(isDev(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});

describe("isLabs", () => {
    it("should return true for labs with proxy", () => {
        validateIsLabsGcpWithProxy(labsOrigins, true);
    });

    it("should return false for prod", () => {
        validateIsLabsGcpWithProxy(prodSbsOrigins, false);
        validateIsLabsGcpWithProxy(prodNavnoOrigins, false);
    });

    it("should return false for other", () => {
        validateIsLabsGcpWithProxy(localhostOrigins, false);

        validateIsLabsGcpWithProxy(devSbs_origins, false);
        validateIsLabsGcpWithProxy(devSbs_devNavnoOrigins, false);

        validateIsLabsGcpWithProxy(devOrigins, false);
        validateIsLabsGcpWithProxy(mockOrigins, false);

        validateIsLabsGcpWithProxy(unknownOrigins, false);
    });

    function validateIsLabsGcpWithProxy(origins: string[], expected: boolean) {
        origins.forEach((origin) => {
            expect(isLabs(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});
