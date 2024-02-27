import React, {useEffect, useState} from "react";
import styles from "./utbetalinger.module.css";
import {BodyLong, Heading, Panel, ToggleGroup} from "@navikt/ds-react";
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
            {isMobile && <FilterModal />}
            <ToggleGroup defaultValue={TAB_VALUE.UTBETALINGER} onChange={(path) => logTabChange(path)} size="medium">
                <ToggleGroup.Item
                    value={TAB_VALUE.UTBETALINGER}
                    onClick={() => {
                        setTabClicked(TAB_VALUE.UTBETALINGER);
                    }}
                >
                    {t("tab1")}
                </ToggleGroup.Item>
                <ToggleGroup.Item
                    value={TAB_VALUE.TIDLIGERE}
                    onClick={() => {
                        setTabClicked(TAB_VALUE.TIDLIGERE);
                    }}
                >
                    {t("tab2")}
                </ToggleGroup.Item>
            </ToggleGroup>
            <div className={styles.tab_panel}>
                {tabClicked === TAB_VALUE.UTBETALINGER && (
                    <>
                        <BodyLong spacing>{t("utbetalingerIngress")}</BodyLong>
                        <NyeUtbetalinger lasterData={henterNye} error={hentNyeFeilet} utbetalinger={filtrerteNye} />
                    </>
                )}
                {tabClicked === TAB_VALUE.TIDLIGERE && (
                    <>
                        <TidligereUtbetalinger />
                    </>
                )}
            </div>
        </Panel>
    );
};

export default UtbetalingerPanelBeta;
