import {Panel} from "nav-frontend-paneler";
import {Normaltekst, Systemtittel, Element} from "nav-frontend-typografi";
import React from "react";
import DokumentBinder from "../ikoner/DocumentBinder";
import "./oppgaver.less";
import Lenke from "nav-frontend-lenker";
import {Checkbox} from "nav-frontend-skjema";
import {Hovedknapp} from "nav-frontend-knapper";

interface Props {
    children?: string | React.ReactChildren;
}

const Oppgaver: React.FC<Props> = ({children}) => {
    return (
        <>
            <Panel className="panel-luft-over">
                <Systemtittel>Dine oppgaver</Systemtittel>
            </Panel>
            <Panel className="panel-glippe-over">

                <div className="oppgaver_ikon_og_tekst">
                    <DokumentBinder/>
                    <div>
                        <Element>Du må sende dokumentasjon til veileder</Element>
                        <Normaltekst>
                            2 vedlegg mangler
                            <br/>
                            Neste frist for innlevering er 23.03.2019
                        </Normaltekst>
                    </div>
                </div>

                <Normaltekst className="luft_over_1rem">
                    Veilederen trenger mer dokumentasjon for å behandle søknaden din.
                    Hvis du ikke leverer dokumentasjonen innen fristen, blir
                    søknaden behandlet med den informasjonen vi har.
                </Normaltekst>

                <Lenke href="./todo" className="luft_over_10px luft_under_1rem">Hjelp til å laste opp?</Lenke>

                <div className="oppgaver_detaljer">
                    <div className="oppgaver_detalj">
                        <Element>Lønnslipp</Element>
                        <Normaltekst>
                            Lønnslippen for mai 2019
                        </Normaltekst>
                        <Checkbox label={'Dette har jeg levert'} className="luft_over_1rem"/>
                    </div>

                    <div className="oppgaver_detalj">
                        <Element>Husleie faktura</Element>
                        <Normaltekst>
                            Din husleie faktura for mai 2019
                        </Normaltekst>
                        <Checkbox label={'Dette har jeg levert'} className="luft_over_1rem"/>
                    </div>
                </div>
                {children && (
                    <Normaltekst>
                        {children}
                    </Normaltekst>
                )}

                <Hovedknapp disabled={true} className="luft_over_2rem luft_under_1rem">Send til veileder</Hovedknapp>
            </Panel>
        </>
    );
};

export default Oppgaver;
