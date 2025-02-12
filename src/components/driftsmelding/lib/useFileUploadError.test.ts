import { waitFor } from "@testing-library/react";

import { server } from "../../../mocks/server";
import { renderHook } from "../../../test/test-utils";
import {
    getHentKommuneInfoMockHandler,
    getHentKommuneInfoResponseMock,
} from "../../../generated/kommune-controller/kommune-controller.msw";
import {
    getHentSoknadsStatusMockHandler,
    getHentSoknadsStatusResponseMock,
} from "../../../generated/soknads-status-controller/soknads-status-controller.msw";
import useFiksDigisosId from "../../../hooks/useFiksDigisosId";

import { useFileUploadError } from "./useFileUploadError";

const KOMMUNE_INNSYN_INACTIVE_RESPONSE = getHentKommuneInfoResponseMock({
    erInnsynDeaktivert: true,
    erInnsynMidlertidigDeaktivert: true,
    erInnsendingEttersendelseDeaktivert: false,
    erInnsendingEttersendelseMidlertidigDeaktivert: false,
});

const KOMMUNE_ETTERSENDELSE_INACTIVE_RESPONSE = getHentKommuneInfoResponseMock({
    erInnsynDeaktivert: false,
    erInnsynMidlertidigDeaktivert: false,
    erInnsendingEttersendelseDeaktivert: true,
    erInnsendingEttersendelseMidlertidigDeaktivert: true,
});

const OK_SOKNAD_RESPONSE = getHentSoknadsStatusResponseMock({ isBroken: false });
const BROKEN_SOKNAD_RESPONSE = getHentSoknadsStatusResponseMock({ isBroken: true });

jest.mock("../../../hooks/useFiksDigisosId", () => jest.fn(() => "dumy"));

describe("useFileUploadAllowed", () => {
    beforeEach(() => {
        (useFiksDigisosId as jest.Mock).mockResolvedValue("dummy-id");
        server.resetHandlers();
    });

    it("skal tillate opplasting dersom innsyn er nede, men ikke ettersendelse", async () => {
        server.use(
            getHentKommuneInfoMockHandler(KOMMUNE_INNSYN_INACTIVE_RESPONSE),
            getHentSoknadsStatusMockHandler(OK_SOKNAD_RESPONSE)
        );

        const { result } = renderHook(() => useFileUploadError());
        await waitFor(() => expect(result.current).toEqual(null));
    });

    it("skal gi feilmelding dersom kommunens ettersendelse er inaktiv", async () => {
        server.use(
            getHentKommuneInfoMockHandler(KOMMUNE_ETTERSENDELSE_INACTIVE_RESPONSE),
            getHentSoknadsStatusMockHandler(OK_SOKNAD_RESPONSE)
        );
        const { result } = renderHook(() => useFileUploadError());
        await waitFor(() => expect(result.current).toEqual("driftsmelding.kanIkkeSendeVedlegg"));
    });

    it("skal gi feilmelding dersom søknaden har isBroken: true pga vedleggmangel", async () => {
        server.use(
            getHentKommuneInfoMockHandler(KOMMUNE_ETTERSENDELSE_INACTIVE_RESPONSE),
            getHentSoknadsStatusMockHandler(BROKEN_SOKNAD_RESPONSE)
        );
        const { result } = renderHook(() => useFileUploadError());
        await waitFor(() => expect(result.current).toEqual("driftsmelding.vedlegg.vedleggMangler"));
    });
});
