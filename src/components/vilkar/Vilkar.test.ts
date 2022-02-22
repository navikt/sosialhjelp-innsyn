import {SaksStatusState, SaksStatus} from "../../redux/innsynsdata/innsynsdataReducer";
import {harSakMedInnvilgetEllerDelvisInnvilgetSak} from "./VilkarUtils";

const saksStatus1: SaksStatusState = {
    tittel: "Saksstatus 1",
    status: SaksStatus.UNDER_BEHANDLING,
    skalViseVedtakInfoPanel: false,
    vedtaksfilUrlList: [],
};
const saksStatus2: SaksStatusState = {
    tittel: "Saksstatus 1",
    status: SaksStatus.UNDER_BEHANDLING,
    skalViseVedtakInfoPanel: false,
    vedtaksfilUrlList: [],
};
const saksStatus3: SaksStatusState = {
    tittel: "Saksstatus 1",
    status: SaksStatus.FERDIGBEHANDLET,
    skalViseVedtakInfoPanel: false,
    vedtaksfilUrlList: [],
};
const saksStatus4: SaksStatusState = {
    tittel: "Saksstatus 1",
    status: SaksStatus.FERDIGBEHANDLET,
    skalViseVedtakInfoPanel: true,
    vedtaksfilUrlList: [],
};

const listSaksStatusState_skal_gi_false: SaksStatusState[] = [saksStatus1, saksStatus2, saksStatus3];

const listSaksStatusState_skal_gi_true: SaksStatusState[] = [saksStatus1, saksStatus2, saksStatus3, saksStatus4];

it("viser kun vedtak info panel når minimum en sak har delvis innvilget eller innvilget som gjeldende vedtak.", () => {
    expect(harSakMedInnvilgetEllerDelvisInnvilgetSak(listSaksStatusState_skal_gi_false)).toEqual(false);
    expect(harSakMedInnvilgetEllerDelvisInnvilgetSak(listSaksStatusState_skal_gi_true)).toEqual(true);
});
