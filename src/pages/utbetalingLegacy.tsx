import React, {useState} from "react";
import Periodevelger from "../utbetalinger/Periodevelger";
import UtbetalingerPanel from "../utbetalinger/UtbetalingerPanel";
import {
    filtrerMaanederUtenUtbetalinger,
    filtrerUtbetalingerForTidsinterval,
    filtrerUtbetalingerPaaMottaker,
} from "../utbetalinger/utbetalingerUtils";
import {logAmplitudeEvent} from "../utils/amplitude";
import styled from "styled-components";
import {useHentUtbetalinger} from "../generated/utbetalinger-controller/utbetalinger-controller";
import {useHentAlleSaker} from "../generated/saks-oversikt-controller/saks-oversikt-controller";
import {useHarSoknaderMedInnsyn} from "../generated/soknad-med-innsyn-controller/soknad-med-innsyn-controller";
import UtbetalingsoversiktIngenSoknader from "../utbetalinger/UtbetalingsoversiktIngenSoknader";
import UtbetalingsoversiktIngenInnsyn from "../utbetalinger/UtbetalingsoversiktIngenInnsyn";
import {usePathname} from "next/navigation";
import {GetServerSideProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import MainLayout from "../components/MainLayout";
import {useTranslation} from "next-i18next";
import useUpdateBreadcrumbs from "../hooks/useUpdateBreadcrumbs";

const DEFAULT_ANTALL_MND_VIST: number = 3;

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
    const {t} = useTranslation();
    const [visAntallMnd, setVisAntallMnd] = useState<number>(DEFAULT_ANTALL_MND_VIST);
    const [hentetAntallMnd, setHentetAntallMnd] = useState<number>(DEFAULT_ANTALL_MND_VIST);
    const [tilBrukersKonto, setTilBrukersKonto] = useState<boolean>(true);
    const [tilAnnenMottaker, setTilAnnenMottaker] = useState<boolean>(true);
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);

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

    const pathname = usePathname();
    useUpdateBreadcrumbs(() => [{title: "Utbetalingsoversikt", url: `/sosialhjelp${pathname}`}]);

    const now: Date = new Date();
    let filtrerteUtbetalinger = filtrerUtbetalingerForTidsinterval(data ?? [], visAntallMnd, now);
    filtrerteUtbetalinger = filtrerUtbetalingerPaaMottaker(filtrerteUtbetalinger, tilBrukersKonto, tilAnnenMottaker);
    filtrerteUtbetalinger = filtrerMaanederUtenUtbetalinger(filtrerteUtbetalinger);

    const {data: alleSaker, isLoading: isAlleSakerLoading} = useHentAlleSaker();

    const {data: harSoknaderMedInnsyn, isLoading: isHarSoknaderMedInnsynLoading} = useHarSoknaderMedInnsyn();

    if (!isAlleSakerLoading && !alleSaker?.length) {
        return (
            <MainLayout title={t("app.tittel")} bannerTitle={"Utbetalingsoversikt"}>
                <UtbetalingsoversiktIngenSoknader />
            </MainLayout>
        );
    }

    if (!isHarSoknaderMedInnsynLoading && !harSoknaderMedInnsyn) {
        return (
            <MainLayout title={t("app.tittel")} bannerTitle={"Utbetalingsoversikt"}>
                <UtbetalingsoversiktIngenInnsyn />
            </MainLayout>
        );
    }

    return (
        <MainLayout title={t("app.tittel")} bannerTitle={"Utbetalingsoversikt"}>
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
        </MainLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
    const translations = await serverSideTranslations(locale ?? "nb", ["common"]);
    return {props: {...translations}};
};

export default Utbetalinger;
