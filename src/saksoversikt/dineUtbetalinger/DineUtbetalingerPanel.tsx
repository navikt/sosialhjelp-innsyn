import React from "react";
import HandCoinsIcon from "../../components/ikoner/HandCoins";
import "./dineUtbetalingerPanel.css";
import {BodyShort, Heading, LinkPanel} from "@navikt/ds-react";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {logButtonOrLinkClick} from "../../utils/amplitude";

const DineUtbetalingerPanel: React.FC = () => {
    const {t} = useTranslation("utbetalinger");

    return (
        <LinkPanel
            className="dine_utbetalinger_panel"
            border={false}
            as={Link}
            to="/utbetaling"
            onClick={() => logButtonOrLinkClick("Bruker åpnet Dine utbetalinger")}
        >
            <div className="dine_utbetalinger_innhold">
                <HandCoinsIcon className="hands_coin_icon" />
                <div>
                    <Heading level="2" size="medium">
                        {t("tittel")}
                    </Heading>
                    <BodyShort>{t("inngang")}</BodyShort>
                </div>
            </div>
        </LinkPanel>
    );
};

export default DineUtbetalingerPanel;
