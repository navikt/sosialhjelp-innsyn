import React from "react";
import {NyeOgTidligereUtbetalingerResponse} from "../../../generated/model";
import Lastestriper from "../../../components/lastestriper/Lasterstriper";
import {Alert, BodyLong} from "@navikt/ds-react";
import ManedGruppe from "./ManedGruppe";
import {useHentTidligereUtbetalinger} from "../../../generated/utbetalinger-controller/utbetalinger-controller";
import useFiltrerteUtbetalinger from "../filter/useFiltrerteUtbetalinger";
import {useFilter} from "../filter/FilterContext";
import {useTranslation} from "react-i18next";

const TidligerUtbetalingerInnhold = () => {
    const {data, isLoading, isError} = useHentTidligereUtbetalinger();
    const filtrerteTidligere = useFiltrerteUtbetalinger(data ?? []);
    const {isUsingFilter} = useFilter();
    const {t} = useTranslation("utbetalinger");

    if (isLoading) {
        return <Lastestriper />;
    }
    if (isError) {
        return (
            <Alert variant="error" inline>
                {t("feil.fetch")}
            </Alert>
        );
    }
    if (filtrerteTidligere.length === 0) {
        return (
            <Alert variant="info" inline>
                {`${t("feil.ingen")} ${isUsingFilter ? t("feil.ingen.filter") : t("feil.ingen.default.tidligere")}`}
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
    const {t} = useTranslation("utbetalinger");

    return (
        <>
            <BodyLong spacing>{t("tidligereIngress")}</BodyLong>
            <TidligerUtbetalingerInnhold />
        </>
    );
};
export default TidligerUtbetalinger;
