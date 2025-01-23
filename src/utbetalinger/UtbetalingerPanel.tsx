import React, { useEffect, useMemo, useState } from "react";
import { BodyLong, Heading, Panel, Tabs } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import HandCoinsIcon from "../components/ikoner/HandCoins";
import { useHentNyeUtbetalinger } from "../generated/utbetalinger-controller/utbetalinger-controller";
import { logAmplitudeEvent } from "../utils/amplitude";
import useIsMobile from "../utils/useIsMobile";

import { filterResponses } from "./filter/lib/filterResponses";
import UtbetalingerNye from "./tabs/UtbetalingerNye";
import { UtbetalingerTidligere } from "./tabs/UtbetalingerTidligere";
import FilterModal from "./filter/FilterModal";
import { useFilter } from "./filter/lib/useFilter";

const TAB_UTBETALINGER = "Utbetalinger" as const;
const TAB_TIDLIGERE = "Tidligere utbetalinger" as const;

const UtbetalingerPanel = () => {
    const [nyeLogged, setNyeLogged] = useState(false);

    const { t } = useTranslation("utbetalinger");

    const { data: nye, isLoading, isError } = useHentNyeUtbetalinger();
    const { filters } = useFilter();

    useEffect(() => {
        logAmplitudeEvent("Lastet utbetalinger", {
            antall: nye?.[0]?.utbetalingerForManed.length ? nye?.[0].utbetalingerForManed.length : 0,
        });

        if (nyeLogged && !nye?.length) return;
        const sisteManedgruppe = nye?.at(-1)?.utbetalingerForManed;
        const sisteDatoVist = sisteManedgruppe?.at(-1)?.utbetalingsdato ?? sisteManedgruppe?.at(-1)?.forfallsdato;

        logAmplitudeEvent("Hentet nye utbetalinger", { sisteDatoVist });
        setNyeLogged(true);
    }, [nye, nyeLogged]);

    const filtrerteNye = useMemo(() => filterResponses(nye, filters), [nye, filters]);

    const logTabChange = (tab: string) => logAmplitudeEvent("Klikket tab", { tab });
    const isMobile = useIsMobile();
    return (
        <Panel className="relative pt-12 max-w-[40rem]">
            <HandCoinsIcon
                className="absolute transform translate-x-[-50%] translate-y-[-50%] top-0 left-1/2 bg-[#9bd0b0] rounded-full h-16 w-16"
                bgcolor="#9BD0B0"
            />
            <Heading className="text-center" size="medium" level="2">
                {t("tittel.inne")}
            </Heading>
            <div className="md:pt-12 pt-4" />
            {isMobile && <FilterModal />}
            <Tabs defaultValue={TAB_UTBETALINGER} onChange={logTabChange}>
                <Tabs.List>
                    <Tabs.Tab value={TAB_UTBETALINGER} label={t("tab1")} />
                    <Tabs.Tab value={TAB_TIDLIGERE} label={t("tab2")} />
                </Tabs.List>
                <Tabs.Panel value={TAB_UTBETALINGER} className="py-4">
                    <BodyLong spacing>{t("utbetalingerIngress")}</BodyLong>
                    <UtbetalingerNye isLoading={isLoading} isError={isError} utbetalinger={filtrerteNye} />
                </Tabs.Panel>
                <Tabs.Panel value={TAB_TIDLIGERE} id="tidligere-utbetalinger-panel" className="py-4">
                    <BodyLong spacing>{t("tidligereIngress")}</BodyLong>
                    <UtbetalingerTidligere />
                </Tabs.Panel>
            </Tabs>
        </Panel>
    );
};

export default UtbetalingerPanel;
