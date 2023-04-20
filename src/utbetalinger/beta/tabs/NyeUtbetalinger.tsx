import React from "react";
import {NyeOgTidligereUtbetalingerResponse} from "../../../generated/model";
import Lastestriper from "../../../components/lastestriper/Lasterstriper";
import {Alert} from "@navikt/ds-react";
import ManedGruppe from "./ManedGruppe";
import {useFilter} from "../filter/FilterContext";

interface Props {
    lasterData: boolean;
    error: boolean;
    utbetalinger: NyeOgTidligereUtbetalingerResponse[];
}

const NyeUtbetalinger = (props: Props) => {
    const {isUsingFilter} = useFilter();
    if (props.lasterData) {
        return <Lastestriper />;
    }
    if (props.error) {
        return (
            <Alert variant="error" inline>
                Noe gikk galt da vi skulle hente utbetalingene dine. Vennligst prøv igjen senere.
            </Alert>
        );
    }
    if (props.utbetalinger.length === 0) {
        return (
            <Alert variant="info" inline>
                {`Vi fant ingen utbetalinger ${
                    isUsingFilter ? "for valgt filtrering." : "for nåværende eller kommende måneder."
                }`}
            </Alert>
        );
    }

    return (
        <>
            {props.utbetalinger.map((utbetalingSak: NyeOgTidligereUtbetalingerResponse) => (
                <ManedGruppe utbetalingSak={utbetalingSak} key={`${utbetalingSak.maned}-${utbetalingSak.ar}`} />
            ))}
        </>
    );
};
export default NyeUtbetalinger;
