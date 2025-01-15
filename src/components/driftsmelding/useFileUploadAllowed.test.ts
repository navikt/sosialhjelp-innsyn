import { http, HttpResponse } from "msw";
import { waitFor } from "@testing-library/react";

import { SoknadsStatusResponse, SoknadsStatusResponseStatus } from "../../generated/model";
import { server } from "../../mocks/server";
import { renderHook } from "../../test/test-utils";

import { useFileUploadAllowed } from "./useFileUploadAllowed";
import { kommuneProblemer } from "./getDriftsmeldingByKommune.test";

const broken: SoknadsStatusResponse = { isBroken: true, status: SoknadsStatusResponseStatus.SENDT };
const notBroken: SoknadsStatusResponse = { isBroken: false, status: SoknadsStatusResponseStatus.SENDT };

const brokenSoknadHandler = http.get(`/api/v1/innsyn/broken/soknadsStatus`, () => HttpResponse.json(broken));
const notBrokenSoknadHandler = http.get(`/api/v1/innsyn/notBroken/soknadsStatus`, () => HttpResponse.json(notBroken));

describe("useFileUploadAllowed", () => {
    it("Opplasting av vedlegg er lov om innsyn er nede, men ikke ettersendelse", () => {
        server.use(notBrokenSoknadHandler);
        const { result } = renderHook(() => useFileUploadAllowed(kommuneProblemer.utenInnsyn, "notBroken"));
        expect(result.current.textKey).toEqual(null);
    });

    it("Opplasting av vedlegg er disabled ved ettersendelse deaktivert", () => {
        server.use(notBrokenSoknadHandler);
        const { result } = renderHook(() => useFileUploadAllowed(kommuneProblemer.utenEttersendelse, "notBroken"));
        expect(result.current.textKey).toEqual("driftsmelding.kanIkkeSendeVedlegg");
    });

    it.skip("Opplasting av vedlegg er disabled ved broken soknad pga vedleggmangel", async () => {
        server.use(brokenSoknadHandler);
        const { result } = renderHook(() => useFileUploadAllowed(kommuneProblemer.ok, "broken"));
        await waitFor(() => expect(result.current.textKey).toEqual("driftsmelding.vedlegg.vedleggMangler"), {
            timeout: 5,
        });
    }, 99999);
});
