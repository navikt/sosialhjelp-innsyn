import React from 'react';
import {Element, EtikettLiten, Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import Periodevelger from "../Periodevelger";
import UtbetalingerAlertStripe from "../alertStripe/UtbetalingerAlertStripe";
import "../utbetalinger.less";
import {Panel} from "nav-frontend-paneler";
import MainNav from "../../components/main-nav/MainNav";
import {EtikettFokus} from "nav-frontend-etiketter";

const UtbetalingerDemo: React.FC = () => {

    return (
        <div className="utbetalinger">

            <div className="utbetalinger_row">
                <div className="utbetalinger_column">
                    <div className="utbetalinger_column_1"/>
                </div>

                <div className="utbetalinger_column">
                    <Innholdstittel>Utbetalingsoversikt</Innholdstittel>

                    <UtbetalingerAlertStripe
                        type="advarsel"
                        tittel="Noen av dine kommende utbetalinger har vilkår"
                    >
                        Du har oppgaver og aktiveter du må gjøre. Gå til
                        søknaden din og les vedtaksbrevet for detaljer.
                    </UtbetalingerAlertStripe>

                    <MainNav />
                </div>

            </div>

            <div className="utbetalinger_row">
                <div className="utbetalinger_column">
                    <div className="utbetalinger_column_1">
                        <Periodevelger className="utbetalinger_periodevelger_panel"/>
                    </div>
                </div>

                    <Panel className="utbetalinger_detaljer">
                        Du har 3 utbetalinger som ikke er utført

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
                    </Panel>

            </div>

        </div>
    );

};

export default UtbetalingerDemo;
