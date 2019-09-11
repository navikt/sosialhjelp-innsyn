import React, {useState} from "react";
import {Element, EtikettLiten, Normaltekst} from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import {NedChevron, OppChevron} from "nav-frontend-chevron";
import {EtikettFokus} from "nav-frontend-etiketter";
import Collapsible from 'react-collapsible';

const UtbetalingerPanel: React.FC = () => {

    const [open, setOpen] = useState(false);

    return (
        <div className="utbetalinger_detaljer">
                <div className="utbetaling_header">
                    <Normaltekst>
                        Du har 3 utbetalinger som ikke er utført
                    </Normaltekst>
                    <span>
                        {open && (
                            <Lenke href="#" onClick={(evt: any) => {setOpen(false);evt.preventDefault();}}>
                                Lukk
                                <OppChevron />
                            </Lenke>
                        )}
                        {!open && (
                            <Lenke href="#" onClick={(evt: any) => {setOpen(true);evt.preventDefault()}}>
                                Mer informasjon
                                <NedChevron />
                            </Lenke>
                        )}
                    </span>
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
    );
};

export default UtbetalingerPanel;
