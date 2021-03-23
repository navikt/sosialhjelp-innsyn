import React from "react";
import {Oppgave} from "../../redux/innsynsdata/innsynsdataReducer";

interface Props {
    oppgave: Oppgave;
}

const OppgaveView: React.FC<Props> = ({oppgave}) => {
    return <div>{oppgave.tittel}</div>;
};

export default OppgaveView;
