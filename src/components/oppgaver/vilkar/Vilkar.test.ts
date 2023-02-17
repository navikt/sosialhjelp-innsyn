import {SaksStatusState, SaksStatus} from "../../../redux/innsynsdata/innsynsdataReducer";
import {harSakMedInnvilgetEllerDelvisInnvilget} from "./VilkarUtils";
import {SaksStatusResponse, SaksStatusResponseStatus} from "../../../generated/model";

const saksStatus1: SaksStatusResponse = {
    tittel: "Saksstatus 1",
    status: SaksStatus.UNDER_BEHANDLING,
    skalViseVedtakInfoPanel: false,
    vedtaksfilUrlList: [],
};
const saksStatus2: SaksStatusResponse = {
    tittel: "Saksstatus 1",
    status: SaksStatus.UNDER_BEHANDLING,
    skalViseVedtakInfoPanel: false,
    vedtaksfilUrlList: [],
};
const saksStatus3: SaksStatusResponse = {
    tittel: "Saksstatus 1",
    status: SaksStatus.FERDIGBEHANDLET,
    skalViseVedtakInfoPanel: false,
    vedtaksfilUrlList: [],
};
const saksStatus4: SaksStatusResponse = {
    tittel: "Saksstatus 1",
    status: SaksStatus.FERDIGBEHANDLET,
    skalViseVedtakInfoPanel: true,
    vedtaksfilUrlList: [],
};

const listSaksStatusState_skal_gi_false: SaksStatusResponse[] = [saksStatus1, saksStatus2, saksStatus3];

const listSaksStatusState_skal_gi_true: SaksStatusResponse[] = [saksStatus1, saksStatus2, saksStatus3, saksStatus4];

it("viser kun vedtak info panel når minimum en sak har delvis innvilget eller innvilget som gjeldende vedtak.", () => {
    expect(harSakMedInnvilgetEllerDelvisInnvilget(listSaksStatusState_skal_gi_false)).toEqual(false);
    expect(harSakMedInnvilgetEllerDelvisInnvilget(listSaksStatusState_skal_gi_true)).toEqual(true);
});
