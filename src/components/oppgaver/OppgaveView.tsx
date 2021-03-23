import React from "react";
import {Oppgaver} from "../../redux/innsynsdata/innsynsdataReducer";
import Oppgave from "./Oppgave";

interface Props {
    oppgave: Oppgaver;
}

const OppgaveView: React.FC<Props> = ({oppgave}) => {
    return (
        <div>
            {oppgave.oppgaveId}
            <Oppgave
                oppgave={oppgave.oppgaveElementer[0]} // må være en forEach
            />
        </div>
    );
};

export default OppgaveView;
