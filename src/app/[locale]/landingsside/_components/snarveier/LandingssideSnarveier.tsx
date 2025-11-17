"use client";

import { useHentAlleSaker } from "@generated/saks-oversikt-controller/saks-oversikt-controller";
import { useHentUtbetalinger } from "@generated/utbetalinger-controller-2/utbetalinger-controller-2";

import SoknaderSnarvei from "./SoknaderSnarvei";
import UtbetalingerSnarvei from "./UtbetalingerSnarvei";

const LandingssideSnarveier = (): React.JSX.Element | null => {
    const { data: alleSaker } = useHentAlleSaker();
    const { data: utbetalinger } = useHentUtbetalinger();
    if (!alleSaker && !utbetalinger) {
        return null;
    }
    return (
        <>
            {alleSaker && alleSaker.length > 0 && <SoknaderSnarvei />}
            {utbetalinger && utbetalinger.length > 0 && <UtbetalingerSnarvei />}
        </>
    );
};

export default LandingssideSnarveier;
