import React, {useEffect, useState} from "react";
import Periodevelger from "./Periodevelger";
import UtbetalingerPanel from "./UtbetalingerPanel";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import "./utbetalinger.css";
import {
    filtrerMaanederUtenUtbetalinger,
    filtrerUtbetalingerForTidsinterval,
    filtrerUtbetalingerPaaMottaker,
} from "./utbetalingerUtils";
import {useDispatch} from "react-redux";
import {Feilside, visFeilside} from "../redux/innsynsdata/innsynsdataReducer";
import {logAmplitudeEvent} from "../utils/amplitude";
import {useLocation} from "react-router-dom";
import {setBreadcrumbs} from "../utils/breadcrumbs";
import styled from "styled-components/macro";
import {useHentUtbetalinger} from "../generated/utbetalinger-controller/utbetalinger-controller";
import {useHentAlleSaker} from "../generated/saks-oversikt-controller/saks-oversikt-controller";
import {useHarSoknaderMedInnsyn} from "../generated/soknad-med-innsyn-controller/soknad-med-innsyn-controller";
import UtbetalingsoversiktIngenSoknader from "./UtbetalingsoversiktIngenSoknader";
import UtbetalingsoversiktIngenInnsyn from "./UtbetalingsoversiktIngenInnsyn";

let DEFAULT_ANTALL_MND_VIST: number = 3;

const StyledUtbetalinger = styled.div`
    margin-top: 4rem;
    display: flex;
    flex-direction: row;
    gap: 2rem;
    @media screen and (max-width: 900px) {
        margin-top: 0;

        flex-direction: column;
    }
`;

const StyledUtbetalingerFilter = styled.div`
    display: flex;
    flex-direction: column;
    flex: auto;

    width: 16rem;

    @media screen and (max-width: 900px) {
        width: 100%;

        .utbetalinger_periodevelger_panel {
            width: 100%;
            margin-bottom: 1rem;
        }
    }
`;

const Utbetalinger: React.FC = () => {
    const dispatch = useDispatch();

    document.title = "Utbetalingsoversikt - Økonomisk sosialhjelp";
    const [visAntallMnd, setVisAntallMnd] = useState<number>(DEFAULT_ANTALL_MND_VIST);
    const [hentetAntallMnd, setHentetAntallMnd] = useState<number>(DEFAULT_ANTALL_MND_VIST);
    const [tilBrukersKonto, setTilBrukersKonto] = useState<boolean>(true);
    const [tilAnnenMottaker, setTilAnnenMottaker] = useState<boolean>(true);
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);

    useBannerTittel("Utbetalingsoversikt");

    const {data, isLoading} = useHentUtbetalinger(
        {month: visAntallMnd},
        {
            query: {
                onSuccess: (data) => {
                    if (!pageLoadIsLogged) {
                        logAmplitudeEvent("Lastet utbetalinger", {antall: data.length});
                        setPageLoadIsLogged(true);
                    }
                },
            },
        }
    );

    const oppdaterPeriodeOgMottaker = (antMndTilbake: number, tilDinKnt: boolean, tilAnnenKonto: boolean): void => {
        if (antMndTilbake !== visAntallMnd) {
            setVisAntallMnd(antMndTilbake);
            if (antMndTilbake > hentetAntallMnd) {
                setHentetAntallMnd(antMndTilbake);
            }
        }
        if (tilBrukersKonto !== tilDinKnt) {
            setTilBrukersKonto(tilDinKnt);
        }
        if (tilAnnenMottaker !== tilAnnenKonto) {
            setTilAnnenMottaker(tilAnnenKonto);
        }
    };

    const {pathname} = useLocation();
    useEffect(() => {
        setBreadcrumbs({title: "Utbetalingsoversikt", url: `/sosialhjelp${pathname}`});
    }, [pathname]);

    const now: Date = new Date();
    let filtrerteUtbetalinger = filtrerUtbetalingerForTidsinterval(data ?? [], visAntallMnd, now);
    filtrerteUtbetalinger = filtrerUtbetalingerPaaMottaker(filtrerteUtbetalinger, tilBrukersKonto, tilAnnenMottaker);
    filtrerteUtbetalinger = filtrerMaanederUtenUtbetalinger(filtrerteUtbetalinger);

    const {data: alleSaker, isLoading: isAlleSakerLoading} = useHentAlleSaker();

    const {data: harSoknaderMedInnsyn, isLoading: isHarSoknaderMedInnsynLoading, error} = useHarSoknaderMedInnsyn();

    useEffect(() => {
        if (error) {
            dispatch(visFeilside(Feilside.TEKNISKE_PROBLEMER));
        }
    }, [error, dispatch]);

    if (!isAlleSakerLoading && !alleSaker?.length) {
        return (
            <div className="blokk-center--wide">
                <UtbetalingsoversiktIngenSoknader />
            </div>
        );
    }

    if (!isHarSoknaderMedInnsynLoading && !harSoknaderMedInnsyn) {
        return (
            <div className="blokk-center--wide">
                <UtbetalingsoversiktIngenInnsyn />
            </div>
        );
    }

    return (
        <div className="blokk-center--wide">
            <StyledUtbetalinger>
                <StyledUtbetalingerFilter>
                    <Periodevelger
                        className="utbetalinger_periodevelger_panel"
                        antMndTilbake={visAntallMnd}
                        onChange={(antMndTilbake: number, tilDinKnt: boolean, tilAnnenMottaker: boolean) =>
                            oppdaterPeriodeOgMottaker(antMndTilbake, tilDinKnt, tilAnnenMottaker)
                        }
                    />
                </StyledUtbetalingerFilter>
                <UtbetalingerPanel utbetalinger={filtrerteUtbetalinger} lasterData={isLoading} />
            </StyledUtbetalinger>
        </div>
    );
};

export default Utbetalinger;
