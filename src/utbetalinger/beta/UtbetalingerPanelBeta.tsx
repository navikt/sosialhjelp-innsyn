import React, {useEffect, useState} from "react";
import styles from "./utbetalinger.module.css";
import {BodyLong, Heading, Panel, Tabs} from "@navikt/ds-react";
import HandCoinsIcon from "../../components/ikoner/HandCoins";
import {useHentNyeUtbetalinger} from "../../generated/utbetalinger-controller/utbetalinger-controller";
import {logAmplitudeEvent} from "../../utils/amplitude";
import useFiltrerteUtbetalinger from "./filter/useFiltrerteUtbetalinger";
import NyeUtbetalinger from "./tabs/NyeUtbetalinger";
import TidligereUtbetalinger from "./tabs/TidligereUtbetalinger";
import useIsMobile from "../../utils/useIsMobile";
import FilterModal from "./filter/FilterModal";
import {useTranslation} from "next-i18next";
import {ManedUtbetaling, NyeOgTidligereUtbetalingerResponse} from "../../generated/model";
import styled from "styled-components";

enum TAB_VALUE {
    UTBETALINGER = "Utbetalinger",
    TIDLIGERE = "Tidligere utbetalinger",
}

export interface UtbetalingMedId extends ManedUtbetaling {
    id: string;
}

export interface UtbetalingerResponseMedId extends Omit<NyeOgTidligereUtbetalingerResponse, "utbetalingerForManed"> {
    utbetalingerForManed: UtbetalingMedId[];
}
const StyledSpace = styled.div`
    padding: 1rem 0 0 0;
`;

const UtbetalingerPanelBeta = () => {
    const [nyeLogged, setNyeLogged] = useState(false);

    const [tabClicked, setTabClicked] = useState(TAB_VALUE.UTBETALINGER);

    const {t} = useTranslation("utbetalinger");
    const {
        data: nye,
        isLoading: henterNye,
        isError: hentNyeFeilet,
    } = useHentNyeUtbetalinger({
        query: {
            select: (data) => {
                // Legg på en id på hver utbetaling
                return data.map((item) => {
                    return {
                        ...item,
                        utbetalingerForManed: item.utbetalingerForManed.map((utbetaling: ManedUtbetaling) => {
                            return {
                                ...utbetaling,
                                id: crypto.randomUUID(),
                            };
                        }),
                    };
                });
            },
        },
    });

    useEffect(() => {
        if (!nyeLogged && nye && nye.length > 0) {
            const sisteManedgruppe = nye[nye.length - 1].utbetalingerForManed;
            const sisteDatoVist =
                sisteManedgruppe[sisteManedgruppe.length - 1].utbetalingsdato ??
                sisteManedgruppe[sisteManedgruppe.length - 1].forfallsdato;
            logAmplitudeEvent("Hentet nye utbetalinger", {sisteDatoVist});
            setNyeLogged(true);
        }
        logAmplitudeEvent("Lastet utbetalinger", {
            antall: nye?.[0]?.utbetalingerForManed.length ? nye?.[0].utbetalingerForManed.length : 0,
        });
    }, [nye, nyeLogged]);

    const filtrerteNye = useFiltrerteUtbetalinger(nye ?? []);

    const logTabChange = (tabPath: string) => {
        logAmplitudeEvent("Klikket tab", {tab: tabPath});
    };
    const isMobile = useIsMobile();
    return (
        <Panel className={styles.utbetalinger_panel}>
            <HandCoinsIcon className={styles.utbetalinger_decoration} bgcolor="#9BD0B0" />
            <Heading size="medium" level="2" spacing>
                {t("tittel")}
            </Heading>
            <StyledSpace />
            {isMobile && <FilterModal />}
            <Tabs defaultValue={TAB_VALUE.UTBETALINGER} onChange={(path) => logTabChange(path)}>
                <Tabs.List className={styles.tab_list}>
                    <Tabs.Tab
                        value={TAB_VALUE.UTBETALINGER}
                        label={t("tab1")}
                        onClick={() => {
                            setTabClicked(TAB_VALUE.UTBETALINGER);
                        }}
                        className={`${
                            tabClicked === TAB_VALUE.UTBETALINGER ? styles.tab_list_blue : styles.tab_list_transparent
                        }`}
                    />

                    <Tabs.Tab
                        value={TAB_VALUE.TIDLIGERE}
                        label={t("tab2")}
                        onClick={() => {
                            setTabClicked(TAB_VALUE.TIDLIGERE);
                        }}
                        className={`${
                            tabClicked === TAB_VALUE.TIDLIGERE ? styles.tab_list_blue : styles.tab_list_transparent
                        }`}
                    />
                </Tabs.List>
                <Tabs.Panel value={TAB_VALUE.UTBETALINGER} className={styles.tab_panel}>
                    <BodyLong spacing>{t("utbetalingerIngress")}</BodyLong>
                    <NyeUtbetalinger lasterData={henterNye} error={hentNyeFeilet} utbetalinger={filtrerteNye} />
                </Tabs.Panel>
                <Tabs.Panel value={TAB_VALUE.TIDLIGERE} className={styles.tab_panel}>
                    <TidligereUtbetalinger />
                </Tabs.Panel>
            </Tabs>
        </Panel>
    );
};

export default UtbetalingerPanelBeta;
