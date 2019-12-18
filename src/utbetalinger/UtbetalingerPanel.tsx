import React from "react";
import {Element, Undertittel} from "nav-frontend-typografi";
import {EtikettLiten} from 'nav-frontend-typografi';
import SavnerUtbetalingPanel from "./SavnerUtbetalingPanel";
import UtbetalingEkspanderbart from "./UtbetalingEkspanderbart";
import {UtbetalingMaaned, UtbetalingSakType} from "./service/useUtbetalingerService";
import {formatCurrency, formatDato} from "../utils/formatting";
import Saksdetaljer from "./Saksdetaljer";
import Lastestriper from "../components/lastestriper/Lasterstriper";

interface Props {
    utbetalinger: UtbetalingSakType[];
    lasterData: boolean;
}

const UtbetalingerPanel: React.FC<Props> = ({utbetalinger, lasterData}) => {

    if (lasterData) {
        return (
            <div className="utbetalinger_detaljer">
                <div className="utbetaling__header">
                    <Lastestriper linjer={3}/>
                </div>
            </div>
        )
    }
    return (
        <div className="utbetalinger_detaljer">
            {(!utbetalinger || utbetalinger.length === 0) && (
                <div className="utbetaling__header">
                    <Element>Vi finner ingen registrerte utbetalinger for perioden.</Element>
                </div>
            )}
            {utbetalinger && utbetalinger.map((utbetalingSak: UtbetalingSakType, index: number) => {
                return (
                    <span key={"utbetaling_" + index}>
                        {index > 0 && utbetalinger[index-1].ar !== utbetalingSak.ar && (
                            <>
                                <Undertittel>{utbetalingSak.ar}</Undertittel>
                                <br/>
                            </>
                        )}
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
                                        <Element>{utbetalingMaaned.tittel ? utbetalingMaaned.tittel : "Utbetaling"} </Element>
                                        <Element>{formatCurrency(utbetalingMaaned.belop)} kr</Element>
                                    </div>
                                    <UtbetalingEkspanderbart
                                        tittel={"Utbetalt " + formatDato(utbetalingMaaned.utbetalingsdato)}
                                        defaultOpen={true}
                                    >
                                        <br/>

                                        <div>
                                            {utbetalingMaaned.fom && utbetalingMaaned.tom && (
                                                <div>
                                                    <EtikettLiten>Periode</EtikettLiten>
                                                    <Element>
                                                        {formatDato(utbetalingMaaned.fom)} -
                                                        {formatDato(utbetalingMaaned.tom)}
                                                    </Element>
                                                    <br/>
                                                </div>
                                            )}
                                            {utbetalingMaaned.mottaker && (
                                                <div>
                                                    <EtikettLiten>Mottaker</EtikettLiten>
                                                    <Element>
                                                        {utbetalingMaaned.mottaker}
                                                    </Element>
                                                    <br/>
                                                </div>
                                            )}
                                        </div>
                                  <br/>



                                        <EtikettLiten>Søknaden din</EtikettLiten>
                                        <Saksdetaljer fiksDigisosId={utbetalingMaaned.fiksDigisosId}/>
                                    </UtbetalingEkspanderbart>

                                        {erSisteUtbetaling && (
                                            <hr className="tynnere"/>
                                        )}
                                </span>
                                )
                            })}
                        </div>
                    </span>
                )
            })}

            <SavnerUtbetalingPanel/>
        </div>
    );
};

export default UtbetalingerPanel;
