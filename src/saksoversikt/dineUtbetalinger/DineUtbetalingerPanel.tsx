import React from "react";
import HandCoinsIcon from "../../components/ikoner/HandCoins";
import "./dineUtbetalingerPanel.less";
import {push} from "connected-react-router";
import {useDispatch} from "react-redux";
import {BodyShort, Heading, LinkPanel} from "@navikt/ds-react";

const DineUtbetalingerPanel: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const onClick = (event: any) => {
        dispatch(push("/innsyn/utbetaling"));
        event.preventDefault();
    };

    return (
        <LinkPanel
            href="/sosialhjelp/innsyn/utbetaling"
            onClick={(event: any) => onClick(event)}
            className="panel-luft-over dine_utbetalinger_panel"
            border={false}
        >
            <div className="dine_utbetalinger_innhold">
                <HandCoinsIcon />
                <div>
                    <Heading level="2" size="medium" spacing>
                        Dine utbetalinger
                    </Heading>
                    <BodyShort>Se oversikten over utbetalingene du har fått</BodyShort>
                </div>
            </div>
        </LinkPanel>
    );
};

export default DineUtbetalingerPanel;
