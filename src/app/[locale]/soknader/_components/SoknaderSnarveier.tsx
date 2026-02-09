"use client";

import { ReactNode } from "react";
import { useHentUtbetalinger } from "@generated/utbetalinger-controller-2/utbetalinger-controller-2";

import UtbetalingerSnarvei from "@components/snarveier/UtbetalingerSnarvei";

const SoknaderSnarveier = (): ReactNode => {
    const { data: utbetalinger } = useHentUtbetalinger();
    if (!utbetalinger || utbetalinger.length === 0) {
        return null;
    }
    return <UtbetalingerSnarvei />;
};

export default SoknaderSnarveier;
