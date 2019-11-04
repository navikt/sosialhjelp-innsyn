import React from "react";
import {Element, EtikettLiten, Normaltekst, Undertittel} from "nav-frontend-typografi";
import SavnerUtbetalingPanel from "./SavnerUtbetalingPanel";
import UtbetalingEkspanderbart from "./UtbetalingEkspanderbart";
import {UtbetalingSakType} from "./service/useUtbetalingerService";
import {formatCurrency} from "../utils/formatting";
import {EtikettFokus} from "nav-frontend-etiketter";

const UtbetalingerPanel: React.FC<{utbetalinger: UtbetalingSakType[]}> = ({utbetalinger}) => {


    return (
        <div className="utbetalinger_detaljer">

            {utbetalinger && utbetalinger.map((utbetalingSak: UtbetalingSakType, index: number) => {
                if (utbetalingSak.utbetalinger[0] && utbetalingSak.utbetalinger[0].tittel) {

                    const isoDato: string = utbetalingSak && utbetalingSak.utbetalinger[0] && utbetalingSak.utbetalinger[0].utbetalinger[0] && utbetalingSak.utbetalinger[0].utbetalinger[0].utbetalingsdato;
                    const dato: Date = new Date(isoDato);
                    const maanederNb = [
                        "Januar", "Februar", "Mars", "April", "Mai", "Juni",
                        "Juli", "August", "September", "Oktober", "November", "Desember"
                    ];
                    const tittel: string = maanederNb[dato.getMonth()] + " " + dato.getFullYear();
                    const belop = formatCurrency(utbetalingSak.utbetalinger[0] && utbetalingSak.utbetalinger[0].belop);

                    const dag: number = dato.getDate();
                    const maaned = dato.getMonth() + 1;
                    const formattertDato = (dag > 9 ? (dag) : ("0" + dag)) + "." + (maaned > 9 ? (maaned) : ("0" + maaned)) + "." + dato.getFullYear();

                    return (
                        <div className="utbetalinger_detaljer_panel" key={"utbetaling_" + index}>
                            <div className="utbetaling__header">
                                <Undertittel>{tittel} </Undertittel>
                                <Undertittel>{belop} </Undertittel>
                            </div>

                            <UtbetalingEkspanderbart tittel={"Utbetalt " + formattertDato} >

                                {utbetalingSak.utbetalinger[0] && utbetalingSak.utbetalinger[0].utbetalinger.map((item: any, index: number) => (
                                    <div className="utbetaling__header" key={"utbetaling_detalj_" + index}>
                                        <Element>{item.tittel} </Element>
                                        <Element>{formatCurrency(item.belop)} </Element>
                                    </div>
                                ))}

                                <br/>
                                <pre>{JSON.stringify(utbetalingSak, null, 2)}</pre>
                            </UtbetalingEkspanderbart>
                            <hr/>
                        </div>
                    )
                } else {
                    return null;
                }

            })}


            <h1>Statisk testinfo</h1>

            <div className="utbetalinger_detaljer_panel">

                <div className="utbetaling__header">
                    <Undertittel>April 2019</Undertittel>
                    <Undertittel>3,000 kr</Undertittel>
                </div>

                <hr/>

                <div className="utbetaling__header">
                    <Element>Reiseutgifter</Element>
                    <Element>700 kr</Element>
                </div>

                <UtbetalingEkspanderbart tittel="Utbetalt 30.04.2019">
                    <Normaltekst>
                        Her kommer det mer...
                    </Normaltekst>
                </UtbetalingEkspanderbart>

                <hr/>

                <div className="utbetaling__header">
                    <Element>Livsopphold</Element>
                    <Element>2,300 kr</Element>
                </div>

                <UtbetalingEkspanderbart tittel="Utbetalt 17.05.2019">

                    <div className="utbetaling__header">
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
                </UtbetalingEkspanderbart>


            </div>




            <SavnerUtbetalingPanel/>
        </div>
    );
};

export default UtbetalingerPanel;

/*

            <h1>Statisk testinfo</h1>

            <div className="utbetalinger_detaljer_panel">

                <div className="utbetaling__header">
                    <Undertittel>April 2019</Undertittel>
                    <Undertittel>3,000 kr</Undertittel>
                </div>

                <hr/>

                <div className="utbetaling__header">
                    <Element>Reiseutgifter</Element>
                    <Element>700 kr</Element>
                </div>

                <UtbetalingEkspanderbart tittel="Utbetalt 30.04.2019">
                    <Normaltekst>
                        Her kommer det mer...
                    </Normaltekst>
                </UtbetalingEkspanderbart>

                <hr/>

                <div className="utbetaling__header">
                    <Element>Livsopphold</Element>
                    <Element>2,300 kr</Element>
                </div>

                <UtbetalingEkspanderbart tittel="Utbetalt 17.05.2019">

                    <div className="utbetaling__header">
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
                </UtbetalingEkspanderbart>


            </div>

 */
