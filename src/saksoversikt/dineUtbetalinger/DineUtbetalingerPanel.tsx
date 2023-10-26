import React, {useEffect} from "react";
import HandCoinsIcon from "../../components/ikoner/HandCoins";
import styles from "./dineUtbetalingerPanel.module.css";
import {BodyShort, Heading, LinkPanel} from "@navikt/ds-react";
import {useTranslation} from "next-i18next";
import Link from "next/link";
import {logAmplitudeEvent, logButtonOrLinkClick} from "../../utils/amplitude";

const DineUtbetalingerPanel: React.FC = () => {
    const {t} = useTranslation("utbetalinger");

    // TODO: finn en mer optimal løsning, uten useEffect kjøres dette flere ganger når det hovedsaklig kjøre en gang når søker kommer inn på sosialhjelp-innsyn
    useEffect(() => {
        logAmplitudeEvent("Dine utbetalinger panel vises");
    });

    return (
        <Link href="/utbetaling" legacyBehavior passHref>
            <LinkPanel
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
        </Link>
    );
};

export default DineUtbetalingerPanel;
