import React from "react";
import { BodyShort, Heading, LinkPanel } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import HandCoinsIcon from "../../components/ikoner/HandCoins";
import { logAmplitudeEvent } from "../../utils/amplitude";

import styles from "./dineUtbetalingerPanel.module.css";

logAmplitudeEvent("Dine utbetalinger panel vises");

const DineUtbetalingerPanel = () => {
    const t = useTranslations("utbetalinger");
    return (
        <LinkPanel
            href="/utbetaling"
            as={Link}
            className={styles.dine_utbetalinger_panel}
            border={false}
            onClick={() => {
                window.umami.track("lenket klikket", {
                    tekst: "Åpnet Dine utbetalinger",
                });
            }}
        >
            <div className={styles.dine_utbetalinger_innhold}>
                <HandCoinsIcon className={styles.hands_coin_icon} />
                <div>
                    <Heading level="2" size="medium">
                        {t("tittel.ute")}
                    </Heading>
                    <BodyShort>{t("inngang")}</BodyShort>
                </div>
            </div>
        </LinkPanel>
    );
};

export default DineUtbetalingerPanel;
