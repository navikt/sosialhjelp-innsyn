import React from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import {Checkbox} from "nav-frontend-skjema";
import Lenke from "nav-frontend-lenker";
import UploadFile from "../ikoner/UploadFile";
import {Oppgave, Vedlegg} from "../../redux/innsynsdata/innsynsdataReducer";
import VedleggView from "./VedleggView";

interface Props {
    oppgave: Oppgave;
    key: any;
}

const OppgaveView: React.FC<Props> = ({oppgave, key}) => {
    return (
        <div className="oppgaver_detalj" key={key}>
            <Element>{oppgave.dokumenttype}</Element>
            <Normaltekst className="luft_over_4px">
                {oppgave.tilleggsinformasjon}
            </Normaltekst>

            {oppgave.vedlegg && oppgave.vedlegg.length === 0 && (
                <Checkbox label={'Dette har jeg levert'} className="luft_over_1rem"/>
            )}
            {oppgave.vedlegg && oppgave.vedlegg.length > 0 && oppgave.vedlegg.map((vedlegg: Vedlegg) =>
                <VedleggView vedlegg={vedlegg}/>
            )}

            <div className="oppgaver_last_opp_fil">
                <UploadFile className="last_opp_fil_ikon"/>
                <Lenke href="/todo">
                    <Element>Last opp vedlegg</Element>
                </Lenke>
            </div>

        </div>
    )
};

export default OppgaveView;
