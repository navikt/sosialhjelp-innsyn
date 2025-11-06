import React from "react";
import { BodyShort, Heading, LinkPanel } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";

import HandCoinsIcon from "../../components/ikoner/HandCoins";
import { umamiTrack } from "../../app/umami";

import styles from "./dineUtbetalingerPanel.module.css";

const DineUtbetalingerPanel = () => {
    const t = useTranslations("utbetalinger");
    const params = useRouter();
    const locale = params.query.locale;
    return (
        <LinkPanel
            href={`/${locale}/utbetaling`}
            as={Link}
            className={styles.dine_utbetalinger_panel}
            border={false}
            onClick={() => {
                umamiTrack("lenke klikket", {
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
