"use client";

import LandingssideSnarvei from "@components/snarveier/LandingssideSnarvei";
import SoknaderSnarvei from "@components/snarveier/SoknaderSnarvei";
import UtbetalingerSnarvei from "@components/snarveier/UtbetalingerSnarvei";

const SoknadSnarveier = () => {
    return (
        <>
            <UtbetalingerSnarvei />
            <SoknaderSnarvei />
            <LandingssideSnarvei />
        </>
    );
};

export default SoknadSnarveier;
