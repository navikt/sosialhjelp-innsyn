import React from "react";
import {NyeOgTidligereUtbetalingerResponse} from "../../../generated/model";
import Lastestriper from "../../../components/lastestriper/Lasterstriper";
import {Alert} from "@navikt/ds-react";
import ManedGruppe from "./ManedGruppe";

interface Props {
    lasterData: boolean;
    error: boolean;
    utbetalinger: NyeOgTidligereUtbetalingerResponse[];
}

const NyeUtbetalinger = (props: Props) => {
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
                Vi finner ingen utbetalinger
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
