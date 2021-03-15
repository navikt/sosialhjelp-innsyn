import {KommuneResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import {
    Driftsmelding,
    DriftsmeldingTypeKeys,
    isUploadFilesAllowed,
    getDriftsmeldingByKommuneResponse,
} from "./DriftsmeldingUtilities";

const kommuneResponse_ok: KommuneResponse = {
    erInnsynDeaktivert: false,
    erInnsynMidlertidigDeaktivert: false,
    erInnsendingEttersendelseDeaktivert: false,
    erInnsendingEttersendelseMidlertidigDeaktivert: false,
    tidspunkt: new Date(),
};

const kommuneResponse_innsyn_deaktivert: KommuneResponse = {
    erInnsynDeaktivert: true,
    erInnsynMidlertidigDeaktivert: true,
    erInnsendingEttersendelseDeaktivert: false,
    erInnsendingEttersendelseMidlertidigDeaktivert: false,
    tidspunkt: new Date(),
};

const kommuneResponse_ettersendelse_deaktivert: KommuneResponse = {
    erInnsynDeaktivert: false,
    erInnsynMidlertidigDeaktivert: false,
    erInnsendingEttersendelseDeaktivert: true,
    erInnsendingEttersendelseMidlertidigDeaktivert: true,
    tidspunkt: new Date(),
};

const kommuneResponse_innsyn_og_ettersendelse_deaktivert: KommuneResponse = {
    erInnsynDeaktivert: true,
    erInnsynMidlertidigDeaktivert: true,
    erInnsendingEttersendelseDeaktivert: true,
    erInnsendingEttersendelseMidlertidigDeaktivert: true,
    tidspunkt: new Date(),
};

const kommuneResponse_litt_diverse: KommuneResponse = {
    erInnsynDeaktivert: true,
    erInnsynMidlertidigDeaktivert: false,
    erInnsendingEttersendelseDeaktivert: true,
    erInnsendingEttersendelseMidlertidigDeaktivert: false,
    tidspunkt: new Date(),
};

it("viser driftsmelding for riktig kommune state", () => {
    expect(getDriftsmeldingByKommuneResponse(kommuneResponse_ok)).toEqual({
        type: DriftsmeldingTypeKeys.DRIFTSMELDING_INGEN,
    } as Driftsmelding);

    expect(getDriftsmeldingByKommuneResponse(kommuneResponse_innsyn_deaktivert)).toEqual({
        type: DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_DEAKTIVERT,
        textKey: "driftsmelding.innsynDeaktivert",
    } as Driftsmelding);

    expect(getDriftsmeldingByKommuneResponse(kommuneResponse_ettersendelse_deaktivert)).toEqual({
        type: DriftsmeldingTypeKeys.DRIFTSMELDING_ETTERSENDELSE_DEAKTIVERT,
        textKey: "driftsmelding.ettersendelseDeaktivert",
    } as Driftsmelding);

    expect(getDriftsmeldingByKommuneResponse(kommuneResponse_innsyn_og_ettersendelse_deaktivert)).toEqual({
        type: DriftsmeldingTypeKeys.DRIFTSMELDING_INNSYN_OG_ETTERSENDELSE_DEAKTIVERT,
        textKey: "driftsmelding.innsynOgEttersendelseDeaktivert",
    } as Driftsmelding);

    expect(getDriftsmeldingByKommuneResponse(kommuneResponse_litt_diverse)).toEqual({
        type: DriftsmeldingTypeKeys.DRIFTSMELDING_ETTERSENDELSE_DEAKTIVERT,
        textKey: "driftsmelding.ettersendelseDeaktivert",
    } as Driftsmelding);
});

it("Opplasting av vedlegg er disabled ved riktige caser", () => {
    expect(isUploadFilesAllowed(kommuneResponse_innsyn_deaktivert)).toEqual(true);
    expect(isUploadFilesAllowed(kommuneResponse_ettersendelse_deaktivert)).toEqual(false);
});
