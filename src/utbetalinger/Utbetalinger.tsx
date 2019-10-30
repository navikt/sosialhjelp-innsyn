import React from 'react';
import Periodevelger from "./Periodevelger";
import UtbetalingerPanel from "./UtbetalingerPanel";
import "./utbetalinger.less";
import useUtbetalingerService from "./service/useUtbetalingerService";
import {REST_STATUS} from "../utils/restUtils";

const Utbetalinger: React.FC = () => {

    // const [periode, setPeriode] = useState<string|undefined>(undefined);

    const utbetalingerService = useUtbetalingerService();
    console.log("rest: " + utbetalingerService.restStatus);

    if (utbetalingerService.restStatus === REST_STATUS.OK) {
        console.log("Utbetalinger: ");
        // console.log(JSON.stringify(utbetalingerService.payload, null, 8))
    }

    return (
        <div className="utbetalinger">
            <div className="utbetalinger_row">
                <div className="utbetalinger_column">
                    <div className="utbetalinger_column_1">
                        <Periodevelger className="utbetalinger_periodevelger_panel"/>
                    </div>
                </div>
                <UtbetalingerPanel />
            </div>
        </div>
    );

};

export default Utbetalinger;
