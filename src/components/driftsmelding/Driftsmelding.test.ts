import {
    Driftsmelding,
    getDriftsmeldingByKommuneResponseOrDigisosId,
    useFileUploadAllowed,
} from "./DriftsmeldingUtilities";
import {
    KommuneResponse,
    SaksListeResponse,
    SoknadsStatusResponse,
    SoknadsStatusResponseStatus,
} from "../../generated/model";
import {http, HttpResponse} from "msw";
import {server} from "../../mocks/server";
import {renderHook} from "../../test/test-utils";
import {waitFor} from "@testing-library/react";

const kommuneResponse_ok: KommuneResponse = {
    erInnsynDeaktivert: false,
    erInnsynMidlertidigDeaktivert: false,
    erInnsendingEttersendelseDeaktivert: false,
    erInnsendingEttersendelseMidlertidigDeaktivert: false,
    tidspunkt: new Date().toString(),
};

const kommuneResponse_innsyn_deaktivert: KommuneResponse = {
    erInnsynDeaktivert: true,
    erInnsynMidlertidigDeaktivert: true,
    erInnsendingEttersendelseDeaktivert: false,
    erInnsendingEttersendelseMidlertidigDeaktivert: false,
    tidspunkt: new Date().toString(),
};

const kommuneResponse_ettersendelse_deaktivert: KommuneResponse = {
    erInnsynDeaktivert: false,
    erInnsynMidlertidigDeaktivert: false,
    erInnsendingEttersendelseDeaktivert: true,
    erInnsendingEttersendelseMidlertidigDeaktivert: true,
    tidspunkt: new Date().toString(),
};

const kommuneResponse_innsyn_og_ettersendelse_deaktivert: KommuneResponse = {
    erInnsynDeaktivert: true,
    erInnsynMidlertidigDeaktivert: true,
    erInnsendingEttersendelseDeaktivert: true,
    erInnsendingEttersendelseMidlertidigDeaktivert: true,
    tidspunkt: new Date().toString(),
};

const kommuneResponse_litt_diverse: KommuneResponse = {
    erInnsynDeaktivert: true,
    erInnsynMidlertidigDeaktivert: false,
    erInnsendingEttersendelseDeaktivert: true,
    erInnsendingEttersendelseMidlertidigDeaktivert: false,
    tidspunkt: new Date().toString(),
};

const kommuneResponse_alt_er_lov: KommuneResponse = {
    erInnsynDeaktivert: false,
    erInnsynMidlertidigDeaktivert: false,
    erInnsendingEttersendelseDeaktivert: false,
    erInnsendingEttersendelseMidlertidigDeaktivert: false,
    tidspunkt: new Date().toString(),
};

it("viser driftsmelding for riktig kommune state", () => {
    expect(getDriftsmeldingByKommuneResponseOrDigisosId(kommuneResponse_ok)).toEqual(undefined);

    expect(getDriftsmeldingByKommuneResponseOrDigisosId(kommuneResponse_innsyn_deaktivert)).toEqual({
        type: "InnsynDeaktivert",
        textKey: "driftsmelding.innsynDeaktivert",
    } as Driftsmelding);

    expect(getDriftsmeldingByKommuneResponseOrDigisosId(kommuneResponse_ettersendelse_deaktivert)).toEqual({
        type: "EttersendelseDeaktivert",

        textKey: "driftsmelding.ettersendelseDeaktivert",
    } as Driftsmelding);

    expect(getDriftsmeldingByKommuneResponseOrDigisosId(kommuneResponse_innsyn_og_ettersendelse_deaktivert)).toEqual({
        type: "InnsynOgEttersendelseDeaktivert",

        textKey: "driftsmelding.innsynOgEttersendelseDeaktivert",
    } as Driftsmelding);

    expect(getDriftsmeldingByKommuneResponseOrDigisosId(kommuneResponse_litt_diverse)).toEqual({
        type: "EttersendelseDeaktivert",

        textKey: "driftsmelding.ettersendelseDeaktivert",
    } as Driftsmelding);
});

const brokenSoknad = http.get(`/api/v1/innsyn/broken/soknadsStatus`, () => {
    return HttpResponse.json({
        isBroken: true,
        status: SoknadsStatusResponseStatus.SENDT,
    } as SoknadsStatusResponse);
});

const notBrokenSoknad = http.get(`/api/v1/innsyn/notBroken/soknadsStatus`, () => {
    return HttpResponse.json({
        isBroken: false,
        status: SoknadsStatusResponseStatus.SENDT,
    } as SoknadsStatusResponse);
});

it("Opplasting av vedlegg er disabled ved riktige caser", () => {
    server.use(notBrokenSoknad);
    expect(
        renderHook(() => useFileUploadAllowed(kommuneResponse_innsyn_deaktivert, "notBroken")).result.current
            .kanLasteOppVedlegg
    ).toEqual(true);
    expect(
        renderHook(() => useFileUploadAllowed(kommuneResponse_ettersendelse_deaktivert, "notBroken"), {}).result.current
            .kanLasteOppVedlegg
    ).toEqual(false);
    expect(
        renderHook(() => useFileUploadAllowed(kommuneResponse_innsyn_deaktivert, "notBroken").textKey).result.current
    ).toEqual("");
    expect(
        renderHook(() => useFileUploadAllowed(kommuneResponse_ettersendelse_deaktivert, "notBroken").textKey).result
            .current
    ).toEqual("driftsmelding.kanIkkeSendeVedlegg");
});

it("Opplasting av vedlegg er disabled ved broken soknad pga vedleggmangel", async () => {
    server.use(brokenSoknad);
    const {result} = renderHook(() => useFileUploadAllowed(kommuneResponse_alt_er_lov, "broken"));
    await waitFor(() => expect(result.current.kanLasteOppVedlegg).toEqual(false));
    await waitFor(() => expect(result.current.textKey).toEqual("driftsmelding.vedlegg.vedleggMangler"));
});
