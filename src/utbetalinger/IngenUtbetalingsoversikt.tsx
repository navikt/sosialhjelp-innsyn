import React from "react";
import UtbetalingsoversiktIngenInnsyn from "./UtbetalingsoversiktIngenInnsyn";
import UtbetalingsoversiktIngenSoknader from "./UtbetalingsoversiktIngenSoknader";

export const IngenUtbetalingsoversikt = (props: {
    harSoknaderMedInnsyn: boolean;
    lasterSoknaderMedInnsyn: boolean;
    harSaker: boolean;
    leserData: boolean;
}) => {
    if (!props.harSaker && !props.leserData) {
        return <UtbetalingsoversiktIngenSoknader />;
    }
    if (!props.harSoknaderMedInnsyn && !props.lasterSoknaderMedInnsyn) {
        return <UtbetalingsoversiktIngenInnsyn />;
    }
    return null;
};
