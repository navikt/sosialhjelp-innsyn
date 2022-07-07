import React from "react";
import SavnerUtbetalingPanel from "./SavnerUtbetalingPanel";
import UtbetalingEkspanderbart from "./UtbetalingEkspanderbart";
import {UtbetalingMaaned, UtbetalingSakType} from "./service/useUtbetalingerService";
import {formatCurrency, formatDato} from "../utils/formatting";
import Saksdetaljer from "./Saksdetaljer";
import Lastestriper from "../components/lastestriper/Lasterstriper";
import {erDevMiljo} from "../utils/ServiceHookTypes";
import {EtikettLiten} from "../components/etikett/EtikettLiten";
import {Heading, Label} from "@navikt/ds-react";

interface Props {
    utbetalinger: UtbetalingSakType[];
    lasterData: boolean;
}

const sumUtbetalinger = (utbetalingSak: UtbetalingSakType): number => {
    let sum: number = 0;
    utbetalingSak.utbetalinger.map((utbetalingMaaned: UtbetalingMaaned) => {
        sum = sum + utbetalingMaaned.belop;
        return sum;
    });
    return sum;
};

const UtbetalingerPanel: React.FC<Props> = ({utbetalinger, lasterData}) => {
    if (lasterData) {
        return (
            <div className="utbetalinger_detaljer">
                <div className="utbetaling__header">
                    <Lastestriper linjer={3} />
                </div>
            </div>
        );
    }
    return (
        <div className="utbetalinger_detaljer">
            {(!utbetalinger || utbetalinger.length === 0) && (
                <div className="utbetaling__header">
                    <Label>Vi finner ingen registrerte utbetalinger for perioden.</Label>
                </div>
            )}
            {utbetalinger &&
                utbetalinger.map((utbetalingSak: UtbetalingSakType, index: number) => {
                    return (
                        <span key={"utbetaling_" + index}>
                            {index > 0 && utbetalinger[index - 1].ar !== utbetalingSak.ar && (
                                <Heading level="2" size="medium" className="blokk-xs">
                                    {utbetalingSak.ar}
                                </Heading>
                            )}
                            <div className="utbetalinger_detaljer_panel" key={"utbetaling_" + index}>
                                <div className="utbetaling__header bunnSeparator">
                                    <Heading level="2" size="medium">
                                        {utbetalingSak.maned + " " + utbetalingSak.ar}
                                    </Heading>
                                    <Heading level="2" size="medium">
                                        {formatCurrency(sumUtbetalinger(utbetalingSak))} kr
                                    </Heading>
                                </div>
                                {utbetalingSak.utbetalinger.map((utbetalingMaaned: UtbetalingMaaned, index: number) => {
                                    const annenMottaker: boolean = utbetalingMaaned.annenMottaker;
                                    const erIkkeSisteUtbetaling: boolean =
                                        index !== utbetalingSak.utbetalinger.length - 1;
                                    return (
                                        <div
                                            key={"utbetaling_" + index}
                                            className={erIkkeSisteUtbetaling ? "bunnSeparator tynnere" : ""}
                                        >
                                            <div className="utbetaling__header">
                                                <Label>
                                                    {utbetalingMaaned.tittel ? utbetalingMaaned.tittel : "Utbetaling"}{" "}
                                                </Label>
                                                <Label>{formatCurrency(utbetalingMaaned.belop)} kr</Label>
                                            </div>
                                            <UtbetalingEkspanderbart
                                                tittel={"Utbetalt " + formatDato(utbetalingMaaned.utbetalingsdato)}
                                                defaultOpen={erDevMiljo()}
                                            >
                                                <div className="mottaker__wrapper">
                                                    <EtikettLiten>Mottaker</EtikettLiten>
                                                    {annenMottaker ? (
                                                        <Label style={{textTransform: "capitalize"}}>
                                                            {utbetalingMaaned.mottaker}
                                                        </Label>
                                                    ) : (
                                                        <Label>
                                                            Til deg (
                                                            {utbetalingMaaned.utbetalingsmetode && (
                                                                <>{utbetalingMaaned.utbetalingsmetode} </>
                                                            )}
                                                            {utbetalingMaaned.kontonummer})
                                                        </Label>
                                                    )}
                                                </div>
                                                {utbetalingMaaned.fom && utbetalingMaaned.tom && (
                                                    <>
                                                        <EtikettLiten>Periode</EtikettLiten>
                                                        <Label className="blokk-xs">
                                                            {formatDato(utbetalingMaaned.fom)} -
                                                            {formatDato(utbetalingMaaned.tom)}
                                                        </Label>
                                                    </>
                                                )}
                                                <EtikettLiten className="soknad__header">Søknaden din</EtikettLiten>
                                                <Saksdetaljer fiksDigisosId={utbetalingMaaned.fiksDigisosId} border />
                                            </UtbetalingEkspanderbart>
                                        </div>
                                    );
                                })}
                            </div>
                        </span>
                    );
                })}

            <SavnerUtbetalingPanel />
        </div>
    );
};

export default UtbetalingerPanel;
