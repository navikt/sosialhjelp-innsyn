import React from "react";
import {DokumentasjonKrav} from "../../redux/innsynsdata/innsynsdataReducer";

interface Props {
    dokumentasjonKrav: DokumentasjonKrav;
    oppgaverErFraInnsyn: boolean;
    oppgaveIndex: any;
}

const DokumentasjonKravView: React.FC<Props> = ({dokumentasjonKrav, oppgaverErFraInnsyn, oppgaveIndex}) => {
    return <div>hei hei hei {dokumentasjonKrav.frist}</div>;
};

export default DokumentasjonKravView;
