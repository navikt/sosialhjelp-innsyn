import React from "react";
import {Oppgave} from "../../redux/innsynsdata/innsynsdataReducer";

interface Props {
    oppgave: Oppgave;
}

const OppgaveView: React.FC<Props> = ({oppgave}) => {
    return (
        <div>
            {oppgave.tittel}
            {oppgave.beskrivelse}
        </div>
    );
};

export default OppgaveView;
