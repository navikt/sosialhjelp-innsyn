import {
    Driftsmelding,
    isFileUploadAllowed,
    getDriftsmeldingByKommuneResponseOrDigisosId,
} from "./DriftsmeldingUtilities";
import {KommuneResponse} from "../../generated/model";

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

it("Opplasting av vedlegg er disabled ved riktige caser", () => {
    expect(isFileUploadAllowed(kommuneResponse_innsyn_deaktivert)).toEqual(true);
    expect(isFileUploadAllowed(kommuneResponse_ettersendelse_deaktivert)).toEqual(false);
});
