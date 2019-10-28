import React from 'react';
import Periodevelger from "../Periodevelger";
import UtbetalingerPanel from "./UtbetalingPanel";
import "../utbetalinger.less";

const UtbetalingerDemo: React.FC = () => {

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

export default UtbetalingerDemo;
