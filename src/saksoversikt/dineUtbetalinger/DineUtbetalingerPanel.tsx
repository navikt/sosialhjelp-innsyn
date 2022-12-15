import React from "react";
import HandCoinsIcon from "../../components/ikoner/HandCoins";
import "./dineUtbetalingerPanel.css";
import {BodyShort, Heading, LinkPanel} from "@navikt/ds-react";
import {useNavigate} from "react-router-dom";

const DineUtbetalingerPanel: React.FC = () => {
    const navigate = useNavigate();
    const onClick = (event: any) => {
        event.preventDefault();
        navigate("/innsyn/utbetaling");
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
