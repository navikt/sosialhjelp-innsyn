import {
    DokumentasjonEtterspurt,
    DokumentasjonEtterspurtElement,
    SaksStatus,
    SaksStatusState,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {getSkalViseIngenOppgaverPanel, vilkarViewVisesIkke} from "./oppgaverUtilities";

describe("IngenOppgaverPanel", () => {
    const oppgaverIngen: DokumentasjonEtterspurt[] = [];

    const oppgaverMerEnnEn = [
        {
            oppgaveElementer: [
                {
                    dokumenttype: "asdf",
                    erFraInnsyn: true,
                } as DokumentasjonEtterspurtElement,
            ],
        } as DokumentasjonEtterspurt,
    ];

    const saksStatusMedSkalViseVedtakInfoPanelTrue: SaksStatusState = {
        tittel: "Saksstatus 1",
        status: SaksStatus.FERDIGBEHANDLET,
        skalViseVedtakInfoPanel: true,
        vedtaksfilUrlList: [],
    };

    const listSaksStatusState: SaksStatusState[] = [saksStatusMedSkalViseVedtakInfoPanelTrue];

    it("skal vises når bruker ikke har noen oppgaver", () => {
        expect(getSkalViseIngenOppgaverPanel(oppgaverIngen, [])).toEqual(true);
    });

    it("skal ikke vises når bruker har oppgaver", () => {
        expect(getSkalViseIngenOppgaverPanel(oppgaverMerEnnEn, [])).toEqual(false);
    });

    it("skal ikke vises selv om bruker har ingen oppgaver hvis VilkarView panelet vises", () => {
        expect(getSkalViseIngenOppgaverPanel(oppgaverMerEnnEn, listSaksStatusState)).toEqual(false);
    });

    // it("skal være riktig", () => {
    //     expect(vilkarViewVisesIkke(listSaksStatusState)).toEqual(false)
    // })
});
