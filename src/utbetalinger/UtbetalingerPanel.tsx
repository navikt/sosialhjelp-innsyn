import React from "react";
import {Element, Undertittel} from "nav-frontend-typografi";
import {EtikettLiten} from 'nav-frontend-typografi';
import SavnerUtbetalingPanel from "./SavnerUtbetalingPanel";
import UtbetalingEkspanderbart from "./UtbetalingEkspanderbart";
import {UtbetalingMaaned, UtbetalingSakType} from "./service/useUtbetalingerService";
import {formatCurrency, formatDato} from "../utils/formatting";
import Saksdetaljer from "./Saksdetaljer";

const UtbetalingerPanel: React.FC<{ utbetalinger: UtbetalingSakType[] }> = ({utbetalinger}) => {

    return (
        <div className="utbetalinger_detaljer">
            {(!utbetalinger || utbetalinger.length === 0) && (
                <div className="utbetalinger_detaljer_panel" key={"utbetaling_0"}>
                    <div className="utbetaling__header">
                        <Element>Ingen utbetalinger</Element>
                    </div>
                </div>
            )}
            {utbetalinger && utbetalinger.map((utbetalingSak: UtbetalingSakType, index: number) => {
                return (
                    <div className="utbetalinger_detaljer_panel" key={"utbetaling_" + index}>
                        <div className="utbetaling__header">
                            <Undertittel>{utbetalingSak.maned + " " + utbetalingSak.ar}</Undertittel>
                            <Undertittel>{formatCurrency(utbetalingSak.sum)} kr</Undertittel>
                        </div>

                        <hr/>

                        {utbetalingSak.utbetalinger.map((utbetalingMaaned: UtbetalingMaaned, index: number) => {
                            const erSisteUtbetaling: boolean = index !== utbetalingSak.utbetalinger.length - 1;
                            return (
                                <span key={"utbetaling_" + index}>
                                    <div className="utbetaling__header">
                                        <Element>{utbetalingMaaned.tittel} </Element>
                                        <Element>{formatCurrency(utbetalingMaaned.belop)} kr</Element>
                                    </div>
                                    <UtbetalingEkspanderbart
                                        tittel={"Utbetalt " + formatDato(utbetalingMaaned.utbetalingsdato)}
                                    >
                                        <br/>
                                        <EtikettLiten>{utbetalingMaaned.status}</EtikettLiten>
                                        <br/>
                                        <EtikettLiten>Søknaden din</EtikettLiten>
                                        <Saksdetaljer fiksDigisosId={utbetalingMaaned.fiksDigisosId}/>
                                    </UtbetalingEkspanderbart>

                                    {erSisteUtbetaling && (
                                        <hr/>
                                    )}
                                </span>
                            )
                        })}
                    </div>
                )
            })}

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
