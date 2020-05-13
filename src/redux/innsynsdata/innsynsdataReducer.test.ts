import InnsynsdataReducer, {oppdaterOppgaveState, initialState} from "./innsynsdataReducer";

describe("Innsynsdata reducer", () => {
    it("should handle OPPDATER_OPPGAVE_STATE with empty value", () => {
        const eksisterendeOppgave = {innsendelsesfrist: "2020-01-01", oppgaveId: "oppgaveId1", oppgaveElementer: []};
        const action = oppdaterOppgaveState(eksisterendeOppgave.oppgaveId, []);

        const initialStateMedOppgaver = {
            ...initialState,
            oppgaver: [eksisterendeOppgave],
        };

        expect(InnsynsdataReducer(initialStateMedOppgaver, action)).toEqual({...initialStateMedOppgaver, oppgaver: []});
    });

    it("should handle OPPDATER_OPPGAVE_STATE with new and existing values", () => {
        const eksisterendeOppgave1 = {innsendelsesfrist: "2020-01-01", oppgaveId: "oppgaveId1", oppgaveElementer: []};
        const eksisterendeOppgave2 = {innsendelsesfrist: "2020-01-01", oppgaveId: "oppgaveId2", oppgaveElementer: []};
        const action = oppdaterOppgaveState("oppgaveId1", []);

        const initialStateMedOppgaver = {
            ...initialState,
            oppgaver: [eksisterendeOppgave1, eksisterendeOppgave2],
        };

        expect(InnsynsdataReducer(initialStateMedOppgaver, action)).toEqual({
            ...initialStateMedOppgaver,
            oppgaver: [eksisterendeOppgave2],
        });
    });
});
