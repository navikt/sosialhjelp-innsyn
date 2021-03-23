import React from "react";
import {OppgaveInnhold} from "../../redux/innsynsdata/innsynsdataReducer";

interface Props {
    oppgave: OppgaveInnhold;
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
