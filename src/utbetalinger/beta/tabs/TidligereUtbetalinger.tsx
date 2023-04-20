import React from "react";
import {NyeOgTidligereUtbetalingerResponse} from "../../../generated/model";
import Lastestriper from "../../../components/lastestriper/Lasterstriper";
import {Alert, BodyLong} from "@navikt/ds-react";
import ManedGruppe from "./ManedGruppe";
import {useHentTidligereUtbetalinger} from "../../../generated/utbetalinger-controller/utbetalinger-controller";
import useFiltrerteUtbetalinger from "../filter/useFiltrerteUtbetalinger";
import {useFilter} from "../filter/FilterContext";

const TidligerUtbetalingerInnhold = () => {
    const {data, isLoading, isError} = useHentTidligereUtbetalinger();
    const filtrerteTidligere = useFiltrerteUtbetalinger(data ?? []);
    const {isUsingFilter} = useFilter();

    if (isLoading) {
        return <Lastestriper />;
    }
    if (isError) {
        return (
            <Alert variant="error" inline>
                Noe gikk galt da vi skulle hente utbetalingene dine. Vennligst prøv igjen senere.
            </Alert>
        );
    }
    if (filtrerteTidligere.length === 0) {
        return (
            <Alert variant="info" inline>
                {`Vi fant ingen utbetalinger ${isUsingFilter ? "for valgt filtrering." : "for de siste 15 måneder"}`}
            </Alert>
        );
    }

    return (
        <>
            {filtrerteTidligere.map((utbetalingSak: NyeOgTidligereUtbetalingerResponse) => (
                <ManedGruppe utbetalingSak={utbetalingSak} key={`${utbetalingSak.maned}-${utbetalingSak.ar}`} />
            ))}
        </>
    );
};

const TidligerUtbetalinger = () => {
    return (
        <>
            <BodyLong spacing>
                Her ser du utbetalingene du har mottatt. Vi kan kun vise utbetalinger 15 måneder tilbake i tid. Vi kan
                kun vise utbetalinger for økonomisk sosialhjelp. Har du spørsmål til utbetalingene kan du ta kontakt med
                oss på 55 55 33 33.
            </BodyLong>
            <TidligerUtbetalingerInnhold />
        </>
    );
};
export default TidligerUtbetalinger;
