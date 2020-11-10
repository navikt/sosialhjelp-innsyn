import {
    getBaseUrl,
    isDevGcp,
    isLocalhost,
    isLabsGcpWithoutProxy,
    isLabsGcpWithProxy,
    isDevSbs,
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

const devSbs_origins = [
    "https://sosialhjelp-innsyn.dev.nav.no/sosialhjelp/innsyn",
    "https://sosialhjelp-innsyn.dev.nav.no",
];

const devSbsIntern_origins = [
    "https://sosialhjelp-innsyn-intern.dev.nav.no/sosialhjelp/innsyn",
    "https://sosialhjelp-innsyn-intern.dev.nav.no",
];

const devSbs_navnoOrigins = ["https://www-q0.nav.no/sosialhjelp/innsyn", "https://www-q0.nav.no"];

const devSbsIntern_navnoOrigins = ["https://www-q1.nav.no/sosialhjelp/innsyn", "https://www-q1.nav.no"];

const devSbsIntern_devNavnoOrigins = ["https://www-q1.dev.nav.no/sosialhjelp/innsyn", "https://www-q1.dev.nav.no"];

const devSbs_devNavnoOrigins = ["https://www-q0.dev.nav.no/sosialhjelp/innsyn", "https://www-q0.dev.nav.no"];

const labsGcpWithProxyOrigins = ["https://digisos.labs.nais.io/sosialhjelp/innsyn", "https://digisos.labs.nais.io"];

const labsGcpWithoutProxyOrigins = [
    "https://sosialhjelp-innsyn.labs.nais.io/sosialhjelp/innsyn",
    "https://sosialhjelp-innsyn.labs.nais.io",
];

const devGcpOrigins = [
    "https://sosialhjelp-innsyn-gcp.dev.nav.no/sosialhjelp/innsyn",
    "https://sosialhjelp-innsyn-gcp.dev.nav.no",
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

        validateGetBaseUrl(devSbs_devNavnoOrigins, "https://www-q0.dev.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
        validateGetBaseUrl(devSbs_navnoOrigins, "https://www-q0.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
        validateGetBaseUrl(
            devSbs_origins,
            "https://sosialhjelp-login-api.dev.nav.no/sosialhjelp/login-api/innsyn-api/api/v1"
        );
        validateGetBaseUrl(devSbsIntern_navnoOrigins, "https://www-q1.nav.no/sosialhjelp/login-api/innsyn-api/api/v1");
        validateGetBaseUrl(
            devSbsIntern_devNavnoOrigins,
            "https://www-q1.dev.nav.no/sosialhjelp/login-api/innsyn-api/api/v1"
        );
        validateGetBaseUrl(
            devSbsIntern_origins,
            "https://sosialhjelp-login-api-intern.dev.nav.no/sosialhjelp/login-api/innsyn-api/api/v1"
        );

        validateGetBaseUrl(labsGcpWithProxyOrigins, "https://digisos.labs.nais.io/sosialhjelp/innsyn-api/api/v1");
        validateGetBaseUrl(
            labsGcpWithoutProxyOrigins,
            "https://sosialhjelp-innsyn-api.labs.nais.io/sosialhjelp/innsyn-api/api/v1"
        );
        validateGetBaseUrl(
            devGcpOrigins,
            "https://sosialhjelp-innsyn-api-gcp.dev.nav.no/sosialhjelp/innsyn-api/api/v1"
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
        validateGetBaseUrl(devSbs_navnoOrigins, "https://www-q0.nav.no/sosialhjelp/soknad-api");
        validateGetBaseUrl(devSbs_origins, "https://sosialhjelp-soknad-api.dev.nav.no/sosialhjelp/soknad-api");
        validateGetBaseUrl(devSbsIntern_devNavnoOrigins, "https://www-q1.dev.nav.no/sosialhjelp/soknad-api");
        validateGetBaseUrl(devSbsIntern_navnoOrigins, "https://www-q1.nav.no/sosialhjelp/soknad-api");
        validateGetBaseUrl(
            devSbsIntern_origins,
            "https://sosialhjelp-soknad-api-intern.dev.nav.no/sosialhjelp/soknad-api"
        );

        validateGetBaseUrl(labsGcpWithProxyOrigins, "https://digisos.labs.nais.io/sosialhjelp/soknad-api");
        validateGetBaseUrl(
            labsGcpWithoutProxyOrigins,
            "https://sosialhjelp-soknad-api.labs.nais.io/sosialhjelp/soknad-api"
        );
        validateGetBaseUrl(devGcpOrigins, "https://sosialhjelp-soknad-api-gcp.dev.nav.no/sosialhjelp/soknad-api");

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

        validateGetBaseUrl(devSbs_devNavnoOrigins, "https://www-q0.nav.no/person/dittnav/");
        validateGetBaseUrl(devSbs_navnoOrigins, "https://www-q0.nav.no/person/dittnav/");
        validateGetBaseUrl(devSbs_origins, "https://www-q0.nav.no/person/dittnav/");
        validateGetBaseUrl(devSbsIntern_devNavnoOrigins, "https://www-q1.nav.no/person/dittnav/");
        validateGetBaseUrl(devSbsIntern_navnoOrigins, "https://www-q1.nav.no/person/dittnav/");
        validateGetBaseUrl(devSbsIntern_origins, "https://www-q1.nav.no/person/dittnav/");

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

        validateGetBaseUrl(devSbs_devNavnoOrigins, "https://www-q0.dev.nav.no/sosialhjelp/innsyn-api/swagger-ui.html");
        validateGetBaseUrl(devSbs_navnoOrigins, "https://www-q0.nav.no/sosialhjelp/innsyn-api/swagger-ui.html");
        validateGetBaseUrl(
            devSbs_origins,
            "https://sosialhjelp-innsyn-api.dev.nav.no/sosialhjelp/innsyn-api/swagger-ui.html"
        );
        validateGetBaseUrl(
            devSbsIntern_devNavnoOrigins,
            "https://www-q1.dev.nav.no/sosialhjelp/innsyn-api/swagger-ui.html"
        );
        validateGetBaseUrl(devSbsIntern_navnoOrigins, "https://www-q1.nav.no/sosialhjelp/innsyn-api/swagger-ui.html");
        validateGetBaseUrl(
            devSbsIntern_origins,
            "https://sosialhjelp-innsyn-api-intern.dev.nav.no/sosialhjelp/innsyn-api/swagger-ui.html"
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
            "https://sosialhjelp-innsyn-api-gcp.dev.nav.no/sosialhjelp/innsyn-api/swagger-ui.html"
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
        validateIsDev(devSbs_origins, false);
        validateIsDev(devSbs_devNavnoOrigins, false);
        validateIsDev(devSbs_navnoOrigins, false);
        validateIsDev(devSbsIntern_origins, false);
        validateIsDev(devSbsIntern_devNavnoOrigins, false);
        validateIsDev(devSbsIntern_navnoOrigins, false);

        validateIsDev(labsGcpWithProxyOrigins, false);
        validateIsDev(labsGcpWithoutProxyOrigins, false);

        validateIsDev(devGcpOrigins, false);
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
        validateIsDevSbs(devSbs_navnoOrigins, true);
        validateIsDevSbs(devSbsIntern_origins, true);
        validateIsDevSbs(devSbsIntern_devNavnoOrigins, true);
        validateIsDevSbs(devSbsIntern_navnoOrigins, true);
    });

    it("should return false for prod", () => {
        validateIsDevSbs(prodSbsOrigins, false);
        validateIsDevSbs(prodNavnoOrigins, false);
    });

    it("should return false for other", () => {
        validateIsDevSbs(localhostOrigins, false);

        validateIsDevSbs(labsGcpWithProxyOrigins, false);
        validateIsDevSbs(labsGcpWithoutProxyOrigins, false);

        validateIsDevSbs(devGcpOrigins, false);
        validateIsDevSbs(unknownOrigins, false);
    });

    function validateIsDevSbs(origins: string[], expected: boolean) {
        origins.forEach((origin) => {
            expect(isDevSbs(origin) + " for " + origin).toEqual(expected + " for " + origin);
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

        validateIsDevGcp(devSbs_origins, false);
        validateIsDevGcp(devSbs_navnoOrigins, false);
        validateIsDevGcp(devSbs_devNavnoOrigins, false);
        validateIsDevGcp(devSbsIntern_origins, false);
        validateIsDevGcp(devSbsIntern_devNavnoOrigins, false);
        validateIsDevGcp(devSbsIntern_navnoOrigins, false);

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

        validateIsLabsGcpWithProxy(devSbs_origins, false);
        validateIsLabsGcpWithProxy(devSbs_navnoOrigins, false);
        validateIsLabsGcpWithProxy(devSbs_devNavnoOrigins, false);
        validateIsLabsGcpWithProxy(devSbsIntern_origins, false);
        validateIsLabsGcpWithProxy(devSbsIntern_navnoOrigins, false);
        validateIsLabsGcpWithProxy(devSbsIntern_devNavnoOrigins, false);

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
        validateIsLabsGcpWithoutProxy(devSbs_origins, false);
        validateIsLabsGcpWithoutProxy(devSbs_devNavnoOrigins, false);
        validateIsLabsGcpWithoutProxy(devSbs_navnoOrigins, false);
        validateIsLabsGcpWithoutProxy(devSbsIntern_origins, false);
        validateIsLabsGcpWithoutProxy(devSbsIntern_devNavnoOrigins, false);
        validateIsLabsGcpWithoutProxy(devSbsIntern_navnoOrigins, false);
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
