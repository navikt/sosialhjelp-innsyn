import React from "react";
import SavnerUtbetalingPanel from "./SavnerUtbetalingPanel";
import UtbetalingEkspanderbart from "./UtbetalingEkspanderbart";
import {formatCurrency, formatDato} from "../utils/formatting";
import Saksdetaljer from "./Saksdetaljer";
import Lastestriper from "../components/lastestriper/Lasterstriper";
import {erDevMiljo} from "../utils/ServiceHookTypes";
import {Detail, Heading, Label, Panel} from "@navikt/ds-react";
import styled, {css} from "styled-components/macro";
import {ManedUtbetaling, UtbetalingerResponse} from "../generated/model";

interface Props {
    utbetalinger: UtbetalingerResponse[];
    lasterData: boolean;
}

const sumUtbetalinger = (utbetalingSak: UtbetalingerResponse): number => {
    let sum: number = 0;
    utbetalingSak.utbetalinger.map((utbetalingMaaned: ManedUtbetaling) => {
        sum = sum + utbetalingMaaned.belop;
        return sum;
    });
    return sum;
};

const StyledHeading = styled(Heading)`
    display: flex;
    gap: 8px;
    justify-content: space-between;
    width: 100%;
    border-bottom: 2px solid #979797;
    padding-bottom: 1rem;
    text-transform: capitalize;
`;

const StyledPanel = styled(Panel)`
    margin-bottom: 1rem;
`;

const StyledUtbetaling = styled.div<{$erIkkeSiste: boolean}>`
  ${(props) =>
      props.$erIkkeSiste &&
      css`
          border-bottom: 1px solid #979797;
          padding-bottom: 0.5rem;
      `}
}`;

const StyledUtbetalingHeader = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: 1rem;
    margin-bottom: 1rem;
    gap: 16px;
    h3 {
        text-transform: capitalize;
    }
`;

const MottakerWrapper = styled.div`
    margin: 1rem 0;
`;

const UtbetalingerPanel: React.FC<Props> = ({utbetalinger, lasterData}) => {
    if (lasterData) {
        return (
            <div className="utbetalinger_detaljer">
                <Lastestriper linjer={3} />
            </div>
        );
    }

    return (
        <div className="utbetalinger_detaljer">
            {(!utbetalinger || utbetalinger.length === 0) && (
                <Label as="p">Vi finner ingen registrerte utbetalinger for perioden.</Label>
            )}
            {utbetalinger?.map((utbetalingSak: UtbetalingerResponse, index: number) => (
                <React.Fragment key={`${utbetalingSak.foersteIManeden}-${utbetalingSak.maned}-${utbetalingSak.ar}`}>
                    {index > 0 && utbetalinger[index - 1].ar !== utbetalingSak.ar && (
                        <Heading as="p" size="medium">
                            {utbetalingSak.ar}
                        </Heading>
                    )}
                    <StyledPanel forwardedAs="section" key={utbetalingSak.foersteIManeden + "_" + index}>
                        <StyledHeading level="2" size="medium">
                            <span>{utbetalingSak.maned + " " + utbetalingSak.ar}</span>
                            <span>{formatCurrency(sumUtbetalinger(utbetalingSak))} kr</span>
                        </StyledHeading>
                        {utbetalingSak.utbetalinger.map((utbetalingMaaned: ManedUtbetaling, index: number) => {
                            const annenMottaker: boolean = utbetalingMaaned.annenMottaker;
                            const erIkkeSisteUtbetaling: boolean = index !== utbetalingSak.utbetalinger.length - 1;
                            return (
                                <StyledUtbetaling
                                    key={utbetalingMaaned.forfallsdato + "_" + index}
                                    $erIkkeSiste={erIkkeSisteUtbetaling}
                                >
                                    <StyledUtbetalingHeader>
                                        <Heading level="3" size="small">
                                            {utbetalingMaaned.tittel ? utbetalingMaaned.tittel : "Utbetaling"}{" "}
                                        </Heading>
                                        <Label as="p">{formatCurrency(utbetalingMaaned.belop)} kr</Label>
                                    </StyledUtbetalingHeader>
                                    <UtbetalingEkspanderbart
                                        // TODO: Hvordan håndtere undefined utbetalingsdato?
                                        tittel={
                                            !!utbetalingMaaned.utbetalingsdato
                                                ? "Utbetalt " + formatDato(utbetalingMaaned.utbetalingsdato)
                                                : "Ukjent utbetalingsdato"
                                        }
                                        defaultOpen={erDevMiljo()}
                                    >
                                        <MottakerWrapper>
                                            <Detail>Mottaker</Detail>
                                            {annenMottaker ? (
                                                <Label as="p" style={{textTransform: "capitalize"}}>
                                                    {utbetalingMaaned.mottaker}
                                                </Label>
                                            ) : (
                                                <Label as="p">
                                                    Til deg (
                                                    {utbetalingMaaned.utbetalingsmetode && (
                                                        <>{utbetalingMaaned.utbetalingsmetode} </>
                                                    )}
                                                    {utbetalingMaaned.kontonummer})
                                                </Label>
                                            )}
                                        </MottakerWrapper>
                                        {utbetalingMaaned.fom && utbetalingMaaned.tom && (
                                            <>
                                                <Detail>Periode</Detail>
                                                <Label as="p" spacing>
                                                    {formatDato(utbetalingMaaned.fom)} -{" "}
                                                    {formatDato(utbetalingMaaned.tom)}
                                                </Label>
                                            </>
                                        )}
                                        <Saksdetaljer fiksDigisosId={utbetalingMaaned.fiksDigisosId} />
                                    </UtbetalingEkspanderbart>
                                </StyledUtbetaling>
                            );
                        })}
                    </StyledPanel>
                </React.Fragment>
            ))}
            <SavnerUtbetalingPanel />
        </div>
    );
};

export default UtbetalingerPanel;
