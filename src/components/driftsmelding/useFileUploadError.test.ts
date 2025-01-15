import { http, HttpResponse } from "msw";
import { waitFor } from "@testing-library/react";

import { SoknadsStatusResponse, SoknadsStatusResponseStatus } from "../../generated/model";
import { server } from "../../mocks/server";
import { renderHook } from "../../test/test-utils";

import { useFileUploadError } from "./useFileUploadError";
import { kommuneProblemer } from "./getDriftsmeldingByKommune.test";

const broken: SoknadsStatusResponse = { isBroken: true, status: SoknadsStatusResponseStatus.SENDT };
const notBroken: SoknadsStatusResponse = { isBroken: false, status: SoknadsStatusResponseStatus.SENDT };

const brokenSoknadHandler = http.get(`/api/v1/innsyn/broken/soknadsStatus`, () => HttpResponse.json(broken));
const notBrokenSoknadHandler = http.get(`/api/v1/innsyn/notBroken/soknadsStatus`, () => HttpResponse.json(notBroken));

describe("useFileUploadAllowed", () => {
    beforeEach(() => {
        server.resetHandlers();
    });

    it("Opplasting av vedlegg er lov om innsyn er nede, men ikke ettersendelse", async () => {
        server.use(notBrokenSoknadHandler);
        const { result } = renderHook(() => useFileUploadError(kommuneProblemer.utenInnsyn, "notBroken"));
        await waitFor(() => expect(result.current).toEqual(null));
    });

    it("Opplasting av vedlegg er disabled ved begge deaktivert", async () => {
        server.use(notBrokenSoknadHandler);
        const { result } = renderHook(() => useFileUploadError(kommuneProblemer.utenBegge, "notBroken"));
        await waitFor(() => expect(result.current).toEqual("driftsmelding.kanIkkeSendeVedlegg"));
    });

    it("Opplasting av vedlegg er disabled ved ettersendelse deaktivert", async () => {
        server.use(notBrokenSoknadHandler);
        const { result } = renderHook(() => useFileUploadError(kommuneProblemer.utenEttersendelse, "notBroken"));
        await waitFor(() => expect(result.current).toEqual("driftsmelding.kanIkkeSendeVedlegg"));
    });

    it.skip("Opplasting av vedlegg er disabled ved broken soknad pga vedleggmangel", async () => {
        server.use(brokenSoknadHandler);
        const { result } = renderHook(() => useFileUploadError(kommuneProblemer.ok, "broken"));
        await waitFor(() => expect(result.current).toEqual("driftsmelding.kanIkkeSendeVedlegg"), {
            timeout: 5,
        });
    }, 99999);
});
