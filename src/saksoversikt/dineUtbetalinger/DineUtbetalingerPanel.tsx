import React from "react";
import { BodyShort, Heading, LinkPanel } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";
import Link from "next/link";

import HandCoinsIcon from "../../components/ikoner/HandCoins";
import { logAmplitudeEvent, logButtonOrLinkClick } from "../../utils/amplitude";

import styles from "./dineUtbetalingerPanel.module.css";

logAmplitudeEvent("Dine utbetalinger panel vises");

const DineUtbetalingerPanel = () => {
    const { t } = useTranslation("utbetalinger");
    return (
        <LinkPanel
            href="/utbetaling"
            as={Link}
            className={styles.dine_utbetalinger_panel}
            border={false}
            onClick={() => logButtonOrLinkClick("Åpnet Dine utbetalinger")}
        >
            <div className={styles.dine_utbetalinger_innhold}>
                <HandCoinsIcon className={styles.hands_coin_icon} />
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
