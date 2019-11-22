import {SaksStatusState, SaksStatus, VedtakFattet} from "../../redux/innsynsdata/innsynsdataReducer";
import {getSkalViseVilkarView} from "./VilkarUtils";

const saksStatus1: SaksStatusState = {
    tittel: "Saksstatus 1",
    status: SaksStatus.KAN_IKKE_VISES,
    vedtaksfilUrlList: []
};
const saksStatus2: SaksStatusState = {
    tittel: "Saksstatus 1",
    status: SaksStatus.AVSLATT,
    vedtaksfilUrlList: []
};
const saksStatus3: SaksStatusState = {
    tittel: "Saksstatus 1",
    status: SaksStatus.DELVIS_INNVILGET,
    vedtaksfilUrlList: []
};
const saksStatus4: SaksStatusState = {
    tittel: "Saksstatus 1",
    status: SaksStatus.FERDIGBEHANDLET,
    vedtaksfilUrlList: []
};

const listSaksStatusState_skal_gi_false: SaksStatusState[] = [
    saksStatus1,
    saksStatus2,
    saksStatus3
];

const listSaksStatusState_skal_gi_true: SaksStatusState[] = [
    saksStatus1,
    saksStatus2,
    saksStatus3,
    saksStatus4
];

it('viser driftsmelding for riktig kommune state', () => {
    expect(getSkalViseVilkarView(listSaksStatusState_skal_gi_false)).toEqual(false);
    expect(getSkalViseVilkarView(listSaksStatusState_skal_gi_true)).toEqual(true);
});
