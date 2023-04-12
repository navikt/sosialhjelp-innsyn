import React from "react";
import {NyeOgTidligereUtbetalingerResponse} from "../../../generated/model";
import Lastestriper from "../../../components/lastestriper/Lasterstriper";
import {Alert, BodyLong} from "@navikt/ds-react";
import ManedGruppe from "./ManedGruppe";

interface Props {
    lasterData: boolean;
    error: boolean;
    utbetalinger: NyeOgTidligereUtbetalingerResponse[];
}

const TidligerUtbetalingerInnhold = (props: Props) => {
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

const TidligerUtbetalinger = (props: Props) => {
    return (
        <>
            <BodyLong spacing>
                Her ser du utbetalingene du har mottatt. Vi kan kun vise utbetalinger 15 måneder tilbake i tid. Vi kan
                kun vise utbetalinger for økonomisk sosialhjelp. Har du spørsmål til utbetalingene kan du ta kontakt med
                oss på 55 55 33 33.
            </BodyLong>
            <TidligerUtbetalingerInnhold {...props} />
        </>
    );
};
export default TidligerUtbetalinger;
