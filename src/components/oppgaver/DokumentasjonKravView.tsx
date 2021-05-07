import React from "react";
import {DokumentasjonKrav} from "../../redux/innsynsdata/innsynsdataReducer";

interface Props {
    dokumentasjonKrav: DokumentasjonKrav;
    oppgaveIndex: any;
}

const DokumentasjonKravView: React.FC<Props> = ({dokumentasjonKrav, oppgaveIndex}) => {
    return (
        //i mock.responses.digisosSoker i innsyn-api må det legges til mock data.

        <div>hei hei he</div>
    );
};

export default DokumentasjonKravView;
