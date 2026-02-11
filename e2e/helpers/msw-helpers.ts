import { APIRequestContext } from "@playwright/test";
import {
    type DokumentasjonkravDto,
    HendelseDto,
    KlageDto,
    OppgaveResponseBeta,
    OriginalSoknadDto,
    SaksStatusResponse,
    SoknadsStatusResponse,
    VilkarResponse,
} from "../../src/generated/model";
import type { ForelopigSvarResponse, VedleggResponse } from "../../src/generated/ssr/model";

/**
 * Helper to configure MSW mock responses for E2E tests.
 * This allows mocking both server-side (Server Components) and client-side API calls.
 */
export class MswHelper {
    constructor(
        private request: APIRequestContext,
        private baseURL: string
    ) {}

    /**
     * Set a mock response for a specific endpoint
     */
    async mockEndpoint(endpoint: string, response: unknown) {
        await this.request.post(`${this.baseURL}/api/test/msw`, {
            data: { endpoint, response },
        });
    }

    /**
     * Reset all MSW handlers to their defaults
     */
    async reset() {
        await this.request.post(`${this.baseURL}/api/test/msw`, {
            data: { endpoint: "reset" },
        });
    }

    /**
     * Mock saker (søknader) endpoint with empty array
     */
    async mockEmptySaker() {
        await this.mockEndpoint("/api/v1/innsyn/saker", []);
    }

    /**
     * Mock utbetalinger endpoint with empty array
     */
    async mockEmptyUtbetalinger() {
        await this.mockEndpoint("/api/v2/innsyn/utbetalinger", []);
    }

    async mockEmptyDriftsmeldinger() {
        await this.mockEndpoint("/api/status?audience=innsyn", []);
    }

    /**
     * Mock both saker and utbetalinger with empty arrays
     */
    async mockEmptyState() {
        await this.mockEmptySaker();
        await this.mockEmptyUtbetalinger();
        await this.mockEmptyDriftsmeldinger();
    }
}

/**
 * Create a MSW helper instance for the current test
 */
export function createMswHelper(request: APIRequestContext, baseURL: string): MswHelper {
    return new MswHelper(request, baseURL);
}

export async function mockSoknadEndpoints(
    msw: MswHelper,
    soknadId: string,
    overrides?: {
        soknadsStatus?: Partial<SoknadsStatusResponse>;
        vedlegg?: VedleggResponse[];
        originalSoknad?: Partial<OriginalSoknadDto>;
        oppgaver?: OppgaveResponseBeta[];
        dokumentasjonkrav?: DokumentasjonkravDto[];
        forelopigSvar?: Partial<ForelopigSvarResponse>;
        vilkar?: VilkarResponse[];
        saksStatus?: SaksStatusResponse[];
        klager?: KlageDto[];
        hendelser?: HendelseDto[];
    }
) {
    const defaultSoknadsStatus: SoknadsStatusResponse = {
        status: "UNDER_BEHANDLING",
        kommunenummer: "0301",
        tidspunktSendt: "2025-11-15T10:00:00Z",
        soknadsalderIMinutter: 1000,
        navKontor: "NAV Oslo",
        tittel: "Søknad om økonomisk sosialhjelp",
        ...overrides?.soknadsStatus,
    };

    const defaultOriginalSoknad: OriginalSoknadDto = {
        url: "/original.pdf",
        date: new Date().toISOString(),
        size: 1000,
        filename: "soknad.pdf",
        ...overrides?.originalSoknad,
    };

    const defaultForelopigSvar: ForelopigSvarResponse = {
        harMottattForelopigSvar: false,
        ...overrides?.forelopigSvar,
    };

    await msw.mockEndpoint(`/api/v1/innsyn/${soknadId}/soknadsStatus`, defaultSoknadsStatus);
    await msw.mockEndpoint(`/api/v1/innsyn/${soknadId}/vedlegg`, overrides?.vedlegg ?? []);
    await msw.mockEndpoint(`/api/v1/innsyn/${soknadId}/originalSoknad`, defaultOriginalSoknad);
    await msw.mockEndpoint(`/api/v2/innsyn/${soknadId}/oppgaver`, overrides?.oppgaver ?? []);
    await msw.mockEndpoint(`/api/v2/innsyn/${soknadId}/dokumentasjonkrav`, overrides?.dokumentasjonkrav ?? []);
    await msw.mockEndpoint(`/api/v1/innsyn/${soknadId}/forelopigSvar`, defaultForelopigSvar);
    await msw.mockEndpoint(`/api/v2/innsyn/${soknadId}/vilkar`, overrides?.vilkar ?? []);
    await msw.mockEndpoint(`/api/v1/innsyn/${soknadId}/saksStatus`, overrides?.saksStatus ?? []);
    await msw.mockEndpoint(`/api/v1/innsyn/${soknadId}/klager`, overrides?.klager ?? []);
    await msw.mockEndpoint(`/api/v1/innsyn/${soknadId}/hendelser/beta`, overrides?.hendelser ?? []);
}
