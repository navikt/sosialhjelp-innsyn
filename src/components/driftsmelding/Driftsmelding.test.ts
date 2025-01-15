import { http, HttpResponse } from "msw";
import { waitFor } from "@testing-library/react";

import { KommuneResponse, SoknadsStatusResponse, SoknadsStatusResponseStatus } from "../../generated/model";
import { server } from "../../mocks/server";
import { renderHook } from "../../test/test-utils";

import { getDriftsmeldingByKommune } from "./getDriftsmeldingByKommune";
import { useFileUploadAllowed } from "./useFileUploadAllowed";

const kommuneProblemer: Record<
    "ok" | "utenInnsyn" | "utenEttersendelse" | "utenBegge" | "littDiverse",
    KommuneResponse
> = {
    ok: {
        erInnsynDeaktivert: false,
        erInnsynMidlertidigDeaktivert: false,
        erInnsendingEttersendelseDeaktivert: false,
        erInnsendingEttersendelseMidlertidigDeaktivert: false,
        tidspunkt: new Date().toString(),
    },
    utenInnsyn: {
        erInnsynDeaktivert: true,
        erInnsynMidlertidigDeaktivert: true,
        erInnsendingEttersendelseDeaktivert: false,
        erInnsendingEttersendelseMidlertidigDeaktivert: false,
        tidspunkt: new Date().toString(),
    },
    utenEttersendelse: {
        erInnsynDeaktivert: false,
        erInnsynMidlertidigDeaktivert: false,
        erInnsendingEttersendelseDeaktivert: true,
        erInnsendingEttersendelseMidlertidigDeaktivert: true,
        tidspunkt: new Date().toString(),
    },
    utenBegge: {
        erInnsynDeaktivert: true,
        erInnsynMidlertidigDeaktivert: true,
        erInnsendingEttersendelseDeaktivert: true,
        erInnsendingEttersendelseMidlertidigDeaktivert: true,
        tidspunkt: new Date().toString(),
    },
    // Uklart hva som er formålet med denne.
    // "erInnsynDeaktivert" registerer rett nok ikke som at innsyn er deaktivert,
    // kun erInnsynMidlertidigDeaktivert.
    littDiverse: {
        erInnsynDeaktivert: true,
        erInnsynMidlertidigDeaktivert: false,
        erInnsendingEttersendelseDeaktivert: true,
        erInnsendingEttersendelseMidlertidigDeaktivert: false,
        tidspunkt: new Date().toString(),
    },
} as const;

it("viser driftsmelding for riktig kommune state", () => {
    const expectations: [keyof typeof kommuneProblemer, string | undefined][] = [
        ["ok", undefined],
        ["utenInnsyn", "driftsmelding.innsynDeaktivert"],
        ["utenEttersendelse", "driftsmelding.ettersendelseDeaktivert"],
        ["utenBegge", "driftsmelding.innsynOgEttersendelseDeaktivert"],
        ["littDiverse", "driftsmelding.ettersendelseDeaktivert"],
    ];

    for (const [key, expected] of expectations) {
        expect(getDriftsmeldingByKommune(kommuneProblemer[key])).toEqual(expected);
    }
});

const broken: SoknadsStatusResponse = { isBroken: true, status: SoknadsStatusResponseStatus.SENDT };
const notBroken: SoknadsStatusResponse = { isBroken: false, status: SoknadsStatusResponseStatus.SENDT };

const brokenSoknadHandler = http.get(`/api/v1/innsyn/broken/soknadsStatus`, () => HttpResponse.json(broken));
const notBrokenSoknadHandler = http.get(`/api/v1/innsyn/notBroken/soknadsStatus`, () => HttpResponse.json(notBroken));

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
    await waitFor(() => expect(result.current.textKey).toEqual("driftsmelding.vedlegg.vedleggMangler"), { timeout: 5 });
}, 99999);
