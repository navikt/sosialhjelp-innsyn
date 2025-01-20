import React, { useEffect, useState } from "react";
import { BodyLong, Heading, Panel, Tabs } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import HandCoinsIcon from "../../components/ikoner/HandCoins";
import { useHentNyeUtbetalinger } from "../../generated/utbetalinger-controller/utbetalinger-controller";
import { logAmplitudeEvent } from "../../utils/amplitude";
import useIsMobile from "../../utils/useIsMobile";
import { ManedUtbetaling, NyeOgTidligereUtbetalingerResponse } from "../../generated/model";

import styles from "./utbetalinger.module.css";
import useFiltrerteUtbetalinger from "./filter/useFiltrerteUtbetalinger";
import UtbetalingerNye from "./tabs/UtbetalingerNye";
import { UtbetalingerTidligere } from "./tabs/UtbetalingerTidligere";
import FilterModal from "./filter/FilterModal";
import { addIdToUtbetalinger } from "./addIdToUtbetalinger";

const TAB_UTBETALINGER = "Utbetalinger" as const;
const TAB_TIDLIGERE = "Tidligere utbetalinger" as const;
type UtbetalingTab = typeof TAB_UTBETALINGER | typeof TAB_TIDLIGERE;

export interface UtbetalingMedId extends ManedUtbetaling {
    id: string;
}

export interface UtbetalingerResponseMedId extends Omit<NyeOgTidligereUtbetalingerResponse, "utbetalingerForManed"> {
    utbetalingerForManed: UtbetalingMedId[];
}

const UtbetalingerPanelBeta = () => {
    const [nyeLogged, setNyeLogged] = useState(false);

    const [tabClicked, setTabClicked] = useState<UtbetalingTab>(TAB_UTBETALINGER);

    const { t } = useTranslation("utbetalinger");

    const { data: nye, isLoading, isError } = useHentNyeUtbetalinger({ query: { select: addIdToUtbetalinger } });

    useEffect(() => {
        if (!nyeLogged && nye?.length) {
            const sisteManedgruppe = nye?.at(-1)?.utbetalingerForManed;
            const sisteDatoVist = sisteManedgruppe?.at(-1)?.utbetalingsdato ?? sisteManedgruppe?.at(-1)?.forfallsdato;

            logAmplitudeEvent("Hentet nye utbetalinger", { sisteDatoVist });
            setNyeLogged(true);
        }
        logAmplitudeEvent("Lastet utbetalinger", {
            antall: nye?.[0]?.utbetalingerForManed.length ? nye?.[0].utbetalingerForManed.length : 0,
        });
    }, [nye, nyeLogged]);

    const filtrerteNye = useFiltrerteUtbetalinger(nye ?? []);

    const logTabChange = (tab: string) => logAmplitudeEvent("Klikket tab", { tab });
    const isMobile = useIsMobile();
    return (
        <Panel className={styles.utbetalinger_panel}>
            <HandCoinsIcon className={styles.utbetalinger_decoration} bgcolor="#9BD0B0" />
            <Heading size="medium" level="2">
                {t("tittel.inne")}
            </Heading>
            <div className="md:pt-12 pt-4" />
            {isMobile && <FilterModal />}
            <Tabs defaultValue={TAB_UTBETALINGER} onChange={(path) => logTabChange(path)}>
                <Tabs.List>
                    <Tabs.Tab
                        value={TAB_UTBETALINGER}
                        label={t("tab1")}
                        onClick={() => setTabClicked(TAB_UTBETALINGER)}
                        className={tabClicked === TAB_UTBETALINGER ? styles.tab_list_blue : styles.tab_list_transparent}
                    />

                    <Tabs.Tab
                        value={TAB_TIDLIGERE}
                        id="tidligere-utbetalinger"
                        aria-controls="tidligere-utbetalinger-panel"
                        label={t("tab2")}
                        onClick={() => setTabClicked(TAB_TIDLIGERE)}
                        className={tabClicked === TAB_TIDLIGERE ? styles.tab_list_blue : styles.tab_list_transparent}
                    />
                </Tabs.List>
                <Tabs.Panel value={TAB_UTBETALINGER} className={styles.tab_panel}>
                    <BodyLong spacing>{t("utbetalingerIngress")}</BodyLong>
                    <UtbetalingerNye isLoading={isLoading} isError={isError} utbetalinger={filtrerteNye} />
                </Tabs.Panel>
                <Tabs.Panel value={TAB_TIDLIGERE} id="tidligere-utbetalinger-panel" className={styles.tab_panel}>
                    <BodyLong spacing>{t("tidligereIngress")}</BodyLong>
                    <UtbetalingerTidligere />
                </Tabs.Panel>
            </Tabs>
        </Panel>
    );
};

export default UtbetalingerPanelBeta;
