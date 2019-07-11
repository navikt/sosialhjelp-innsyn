import React from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import {Checkbox} from "nav-frontend-skjema";
import {Oppgave, Vedlegg} from "../../redux/innsynsdata/innsynsdataReducer";
import VedleggView from "./VedleggView";

interface Props {
    oppgave: Oppgave;
}

const OppgaveView: React.FC<Props> = ({oppgave}) => {
    return (
        <div className="oppgaver_detalj">
            <Element>{oppgave.dokumenttype}</Element>
            <Normaltekst className="luft_over_4px">
                {oppgave.tilleggsinformasjon}
            </Normaltekst>

            {!oppgave.vedlegg && (
                <Checkbox label={'Dette har jeg levert'} className="luft_over_1rem"/>
            )}

            {oppgave.vedlegg && oppgave.vedlegg.length === 0 && (
                <Checkbox label={'Dette har jeg levert'} className="luft_over_1rem"/>
            )}
            {oppgave.vedlegg && oppgave.vedlegg.length > 0 && oppgave.vedlegg.map((vedlegg: Vedlegg, index: number) =>
                <VedleggView vedlegg={vedlegg} key={index}/>
            )}

            {/*<div className="oppgaver_last_opp_fil">*/}
            {/*    <UploadFile className="last_opp_fil_ikon" onClick={() => {console.warn("todo upload file")}}/>*/}
            {/*    <Lenke href="/todo">*/}
            {/*        <Element>Last opp vedlegg</Element>*/}
            {/*    </Lenke>*/}
            {/*</div>*/}

        </div>
    )
};

export default OppgaveView;
