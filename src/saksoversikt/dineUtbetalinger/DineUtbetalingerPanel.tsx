import React from "react";
import HandCoinsIcon from "../../components/ikoner/HandCoins";
import "./dineUtbetalingerPanel.css";
import {BodyShort, Heading, LinkPanel} from "@navikt/ds-react";
import {Link} from "react-router-dom";

const DineUtbetalingerPanel: React.FC = () => {
    return (
        <LinkPanel className="panel-luft-over dine_utbetalinger_panel" border={false} as={Link} to="/utbetaling">
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
