import {
    getBaseUrl,
    isDevGcp,
    isDev,
    isLabsGcpWithoutProxy,
    isLabsGcpWithProxy,
    isQ,
    getSoknadBaseUrl,
    getNavUrl,
    getApiUrlForSwagger,
} from "./restUtils";

const localhostOrigins = [
    "http://localhost:3003/sosialhjelp/innsyn",
    "http://localhost:3000/sosialhjelp/innsyn",
    "http://localhost:3003",
    "http://localhost:3000",
    "localhost:3003",
    "localhost:3000",
    "localhost",
];

const q0DevSbsOrigins = [
    "https://sosialhjelp-innsyn-q0.dev-sbs.nais.io/sosialhjelp/innsyn",
    "https://sosialhjelp-innsyn-q0.dev-sbs.nais.io",
];

const q1DevSbsOrigins = [
    "https://sosialhjelp-innsyn-q1.dev-sbs.nais.io/sosialhjelp/innsyn",
    "https://sosialhjelp-innsyn-q1.dev-sbs.nais.io",
];

const q0NavnoOrigins = ["https://www-q0.nav.no/sosialhjelp/innsyn", "https://www-q0.nav.no"];

const q1NavnoOrigins = ["https://www-q1.nav.no/sosialhjelp/innsyn", "https://www-q1.nav.no"];

const q1DevNavnoOrigins = ["https://www-q1.dev.nav.no/sosialhjelp/innsyn", "https://www-q1.dev.nav.no"];

const q0DevNavnoOrigins = ["https://www-q0.dev.nav.no/sosialhjelp/innsyn", "https://www-q0.dev.nav.no"];

const labsGcpWithProxyOrigins = ["https://digisos.labs.nais.io/sosialhjelp/innsyn", "https://digisos.labs.nais.io"];

const labsGcpWithoutProxyOrigins = [
    "https://sosialhjelp-innsyn.labs.nais.io/sosialhjelp/innsyn",
    "https://sosialhjelp-innsyn.labs.nais.io",
];

const devGcpOrigins = [
    "https://sosialhjelp-innsyn.dev.nav.no/sosialhjelp/innsyn",
    "https://sosialhjelp-innsyn.dev.nav.no",
];

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

        validateGetBaseUrl(q0DevNavnoOrigins, "https://www-q0.dev.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
        validateGetBaseUrl(q0NavnoOrigins, "https://www-q0.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
        validateGetBaseUrl(
            q0DevSbsOrigins,
            "https://sosialhjelp-login-api-q0.dev-sbs.nais.io/sosialhjelp/login-api/innsyn-api/api/v1"
        );
        validateGetBaseUrl(q1NavnoOrigins, "https://www-q1.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
        validateGetBaseUrl(q1DevNavnoOrigins, "https://www-q1.dev.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
        validateGetBaseUrl(
            q1DevSbsOrigins,
            "https://sosialhjelp-login-api-q1.dev-sbs.nais.io/sosialhjelp/login-api/innsyn-api/api/v1"
        );

        validateGetBaseUrl(labsGcpWithProxyOrigins, "https://digisos.labs.nais.io/sosialhjelp/innsyn-api/api/v1");
        validateGetBaseUrl(
            labsGcpWithoutProxyOrigins,
            "https://sosialhjelp-innsyn-api.labs.nais.io/sosialhjelp/innsyn-api/api/v1"
        );
        validateGetBaseUrl(devGcpOrigins, "https://sosialhjelp-innsyn-api.dev.nav.no/sosialhjelp/innsyn-api/api/v1");

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

        validateGetBaseUrl(q0DevNavnoOrigins, "https://www-q0.dev.nav.no/sosialhjelp/soknad-api");
        validateGetBaseUrl(q0NavnoOrigins, "https://www-q0.nav.no/sosialhjelp/soknad-api");
        validateGetBaseUrl(q0DevSbsOrigins, "https://sosialhjelp-soknad-api-q0.dev-sbs.nais.io/sosialhjelp/soknad-api");
        validateGetBaseUrl(q1DevNavnoOrigins, "https://www-q1.dev.nav.no/sosialhjelp/soknad-api");
        validateGetBaseUrl(q1NavnoOrigins, "https://www-q1.nav.no/sosialhjelp/soknad-api");
        validateGetBaseUrl(q1DevSbsOrigins, "https://sosialhjelp-soknad-api-q1.dev-sbs.nais.io/sosialhjelp/soknad-api");

        validateGetBaseUrl(labsGcpWithProxyOrigins, "https://digisos.labs.nais.io/sosialhjelp/soknad-api");
        validateGetBaseUrl(
            labsGcpWithoutProxyOrigins,
            "https://sosialhjelp-soknad-api.labs.nais.io/sosialhjelp/soknad-api"
        );
        validateGetBaseUrl(devGcpOrigins, "https://sosialhjelp-soknad-api.dev.nav.no/sosialhjelp/soknad-api");

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
        validateGetBaseUrl(localhostOrigins, "https://www-q0.nav.no/person/dittnav/");

        validateGetBaseUrl(q0DevNavnoOrigins, "https://www-q0.nav.no/person/dittnav/");
        validateGetBaseUrl(q0NavnoOrigins, "https://www-q0.nav.no/person/dittnav/");
        validateGetBaseUrl(q0DevSbsOrigins, "https://www-q0.nav.no/person/dittnav/");
        validateGetBaseUrl(q1DevNavnoOrigins, "https://www-q1.nav.no/person/dittnav/");
        validateGetBaseUrl(q1NavnoOrigins, "https://www-q1.nav.no/person/dittnav/");
        validateGetBaseUrl(q1DevSbsOrigins, "https://www-q1.nav.no/person/dittnav/");

        validateGetBaseUrl(labsGcpWithProxyOrigins, "https://www-q0.nav.no/person/dittnav/");
        validateGetBaseUrl(labsGcpWithoutProxyOrigins, "https://www-q0.nav.no/person/dittnav/");
        validateGetBaseUrl(devGcpOrigins, "https://www-q0.nav.no/person/dittnav/");

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

describe("getSwaggerUrl", () => {
    it("should return correct backend-url", () => {
        validateGetBaseUrl(localhostOrigins, "http://localhost:8080/sosialhjelp/innsyn-api/swagger-ui.html");

        validateGetBaseUrl(q0DevNavnoOrigins, "https://www-q0.dev.nav.no/sosialhjelp/innsyn-api/swagger-ui.html");
        validateGetBaseUrl(q0NavnoOrigins, "https://www-q0.nav.no/sosialhjelp/innsyn-api/swagger-ui.html");
        validateGetBaseUrl(
            q0DevSbsOrigins,
            "https://sosialhjelp-innsyn-api-q0.dev-sbs.nais.io/sosialhjelp/innsyn-api/swagger-ui.html"
        );
        validateGetBaseUrl(q1DevNavnoOrigins, "https://www-q1.dev.nav.no/sosialhjelp/innsyn-api/swagger-ui.html");
        validateGetBaseUrl(q1NavnoOrigins, "https://www-q1.nav.no/sosialhjelp/innsyn-api/swagger-ui.html");
        validateGetBaseUrl(
            q1DevSbsOrigins,
            "https://sosialhjelp-innsyn-api-q1.dev-sbs.nais.io/sosialhjelp/innsyn-api/swagger-ui.html"
        );

        validateGetBaseUrl(
            labsGcpWithProxyOrigins,
            "https://digisos.labs.nais.io/sosialhjelp/innsyn-api/swagger-ui.html"
        );
        validateGetBaseUrl(
            labsGcpWithoutProxyOrigins,
            "https://sosialhjelp-innsyn-api.labs.nais.io/sosialhjelp/innsyn-api/swagger-ui.html"
        );
        validateGetBaseUrl(
            devGcpOrigins,
            "https://sosialhjelp-innsyn-api.dev.nav.no/sosialhjelp/innsyn-api/swagger-ui.html"
        );
    });

    it("should return nothing for prod", () => {
        validateGetBaseUrl(prodSbsOrigins, "");
        validateGetBaseUrl(prodNavnoOrigins, "");
    });

    it("should default to nothing when url is unknown correct backend-url", () => {
        validateGetBaseUrl(unknownOrigins, "");
    });

    function validateGetBaseUrl(origins: string[], expected: string) {
        origins.forEach((origin) => {
            expect(getApiUrlForSwagger(origin) + " for " + origin).toEqual(expected + " for " + origin);
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
        validateIsDev(q0DevSbsOrigins, false);
        validateIsDev(q0DevNavnoOrigins, false);
        validateIsDev(q0NavnoOrigins, false);
        validateIsDev(q1DevSbsOrigins, false);
        validateIsDev(q1DevNavnoOrigins, false);
        validateIsDev(q1NavnoOrigins, false);

        validateIsDev(labsGcpWithProxyOrigins, false);
        validateIsDev(labsGcpWithoutProxyOrigins, false);

        validateIsDev(devGcpOrigins, false);
        validateIsDev(unknownOrigins, false);
    });

    function validateIsDev(origins: string[], expected: boolean) {
        origins.forEach((origin) => {
            expect(isDev(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});

describe("isQ", () => {
    it("should return true for dev-sbs", () => {
        validateIsQ(q0DevSbsOrigins, true);
        validateIsQ(q0DevNavnoOrigins, true);
        validateIsQ(q0NavnoOrigins, true);
        validateIsQ(q1DevSbsOrigins, true);
        validateIsQ(q1DevNavnoOrigins, true);
        validateIsQ(q1NavnoOrigins, true);
    });

    it("should return false for prod", () => {
        validateIsQ(prodSbsOrigins, false);
        validateIsQ(prodNavnoOrigins, false);
    });

    it("should return false for other", () => {
        validateIsQ(localhostOrigins, false);

        validateIsQ(labsGcpWithProxyOrigins, false);
        validateIsQ(labsGcpWithoutProxyOrigins, false);

        validateIsQ(devGcpOrigins, false);
        validateIsQ(unknownOrigins, false);
    });

    function validateIsQ(origins: string[], expected: boolean) {
        origins.forEach((origin) => {
            expect(isQ(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});

describe("isDevGcp", () => {
    it("should return true for dev-sbs", () => {
        validateIsDevGcp(devGcpOrigins, true);
    });

    it("should return false for prod", () => {
        validateIsDevGcp(prodSbsOrigins, false);
        validateIsDevGcp(prodNavnoOrigins, false);
    });

    it("should return false for other", () => {
        validateIsDevGcp(localhostOrigins, false);

        validateIsDevGcp(q0DevSbsOrigins, false);
        validateIsDevGcp(q0NavnoOrigins, false);
        validateIsDevGcp(q0DevNavnoOrigins, false);
        validateIsDevGcp(q1DevSbsOrigins, false);
        validateIsDevGcp(q1DevNavnoOrigins, false);
        validateIsDevGcp(q1NavnoOrigins, false);

        validateIsDevGcp(labsGcpWithProxyOrigins, false);
        validateIsDevGcp(labsGcpWithoutProxyOrigins, false);

        validateIsDevGcp(unknownOrigins, false);
    });

    function validateIsDevGcp(origins: string[], expected: boolean) {
        origins.forEach((origin) => {
            expect(isDevGcp(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});

describe("isLabsGcpWithProxy", () => {
    it("should return true for labs with proxy", () => {
        validateIsLabsGcpWithProxy(labsGcpWithProxyOrigins, true);
    });

    it("should return false for prod", () => {
        validateIsLabsGcpWithProxy(prodSbsOrigins, false);
        validateIsLabsGcpWithProxy(prodNavnoOrigins, false);
    });

    it("should return false for other", () => {
        validateIsLabsGcpWithProxy(localhostOrigins, false);

        validateIsLabsGcpWithProxy(q0DevSbsOrigins, false);
        validateIsLabsGcpWithProxy(q0NavnoOrigins, false);
        validateIsLabsGcpWithProxy(q0DevNavnoOrigins, false);
        validateIsLabsGcpWithProxy(q1DevSbsOrigins, false);
        validateIsLabsGcpWithProxy(q1NavnoOrigins, false);
        validateIsLabsGcpWithProxy(q1DevNavnoOrigins, false);

        validateIsLabsGcpWithProxy(devGcpOrigins, false);
        validateIsLabsGcpWithProxy(labsGcpWithoutProxyOrigins, false);

        validateIsLabsGcpWithProxy(unknownOrigins, false);
    });

    function validateIsLabsGcpWithProxy(origins: string[], expected: boolean) {
        origins.forEach((origin) => {
            expect(isLabsGcpWithProxy(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});

describe("isLabsGcpWithoutProxy", () => {
    it("should return true for labs without proxy", () => {
        validateIsLabsGcpWithoutProxy(labsGcpWithoutProxyOrigins, true);
    });

    it("should return false for prod", () => {
        validateIsLabsGcpWithoutProxy(prodSbsOrigins, false);
        validateIsLabsGcpWithoutProxy(prodNavnoOrigins, false);
    });

    it("should return false for other", () => {
        validateIsLabsGcpWithoutProxy(localhostOrigins, false);
        validateIsLabsGcpWithoutProxy(q0DevSbsOrigins, false);
        validateIsLabsGcpWithoutProxy(q0DevNavnoOrigins, false);
        validateIsLabsGcpWithoutProxy(q0NavnoOrigins, false);
        validateIsLabsGcpWithoutProxy(q1DevSbsOrigins, false);
        validateIsLabsGcpWithoutProxy(q1DevNavnoOrigins, false);
        validateIsLabsGcpWithoutProxy(q1NavnoOrigins, false);
        validateIsLabsGcpWithoutProxy(devGcpOrigins, false);
        validateIsLabsGcpWithoutProxy(labsGcpWithProxyOrigins, false);
        validateIsLabsGcpWithoutProxy(unknownOrigins, false);
    });

    function validateIsLabsGcpWithoutProxy(origins: string[], expected: boolean) {
        origins.forEach((origin) => {
            expect(isLabsGcpWithoutProxy(origin) + " for " + origin).toEqual(expected + " for " + origin);
        });
    }
});
