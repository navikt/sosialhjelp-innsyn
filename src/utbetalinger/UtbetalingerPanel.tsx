import React, {useState} from "react";
import {Element, EtikettLiten, Normaltekst, Undertittel} from "nav-frontend-typografi";
import {EtikettFokus} from "nav-frontend-etiketter";
import Collapsible from 'react-collapsible';
import EkspanderLink from "./EkspanderLink";

const UtbetalingerPanel: React.FC = () => {

    const [open, setOpen] = useState(false);

    return (
        <div className="utbetalinger_detaljer">

            <div className="utbetalinger_detaljer_panel">

            <div className="utbetaling_wrapper">
                <Undertittel>April 2019</Undertittel>
                <Undertittel>3,000 kr</Undertittel>
            </div>

            <hr/>

            <div className="utbetaling_wrapper">
                <Element>Reiseutgifter</Element>
                <Element>700 kr</Element>
            </div>

            <div className="utbetaling_header">
                <Normaltekst>
                    Utbetalt 30.04.2019
                </Normaltekst>
                <EkspanderLink open={open} setOpen={setOpen}/>
            </div>


            <hr/>

            <div className="utbetaling_wrapper">
                <Element>Livsopphold</Element>
                <Element>2,300 kr</Element>
            </div>

            <div className="utbetaling_header">
                <Normaltekst>
                    Utbetalt 30.04.2019
                </Normaltekst>
                <EkspanderLink open={open} setOpen={setOpen}/>
            </div>

            <Collapsible trigger="" open={open} easing="ease-in-out">
                <div className="utbetaling_wrapper">
                    <div className="utbetaling_tittel">
                        Strøm
                        <EtikettFokus>Vilkår</EtikettFokus>
                    </div>
                    <div className="utbetaling_belop">5,270 kr</div>
                </div>

                <Normaltekst>
                    Ikke utbetalt 28.07.2019
                </Normaltekst>

                <br/>
                <br/>
                <div className="utbetaling_periode_mottaker">
                    <div>
                        <EtikettLiten>Periode</EtikettLiten>
                        <Normaltekst>
                            28.07.2019- 31.08.2018
                        </Normaltekst>
                    </div>
                    <div>
                        <EtikettLiten>Mottaker</EtikettLiten>
                        <Normaltekst>
                            Hafslund
                        </Normaltekst>
                    </div>
                </div>

                <br/>
                <br/>
                <EtikettLiten>Utbetalingen er ikke utført</EtikettLiten>
                <br/>

                <Element>Har du lest vedtaksbrevet ditt?</Element>
                <Normaltekst>
                    Vedtaksbrevet informerer om oppgaver og aktiviteter du må gjøre.
                    Gå til søknaden din for å lese detaljer
                </Normaltekst>
                <br/>
                <Element>Har din økonomiske situasjon endret seg?</Element>
                <Normaltekst>
                    Endring i din økonomiske situasjon kan påvirke utbetalingene dine.
                    Dette kan være lønn, ytelser fra NAV, eller andre inntekter.
                </Normaltekst>
            </Collapsible>
            </div>

        </div>
    );
};

export default UtbetalingerPanel;
