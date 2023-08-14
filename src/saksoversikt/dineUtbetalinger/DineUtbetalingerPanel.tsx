import React from "react";
import HandCoinsIcon from "../../components/ikoner/HandCoins";
import styles from "./dineUtbetalingerPanel.module.css";
import {BodyShort, Heading, LinkPanel} from "@navikt/ds-react";
import {useTranslation} from "next-i18next";
import Link from "next/link";

const DineUtbetalingerPanel: React.FC = () => {
    const {t} = useTranslation("utbetalinger");

    return (
        <Link href="/utbetaling" legacyBehavior passHref>
            <LinkPanel className={styles.dine_utbetalinger_panel} border={false}>
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
        </Link>
    );
};

export default DineUtbetalingerPanel;
