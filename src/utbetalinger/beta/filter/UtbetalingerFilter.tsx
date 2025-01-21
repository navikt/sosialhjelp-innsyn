import React from "react";
import { Fieldset, Radio, RadioGroup } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import { MottakerFilter, useFilter } from "./FilterContext";
import styles from "./utbetalingerFilter.module.css";
import { FilterDatePicker } from "./FilterDatePicker";

const UtbetalingerFilter = () => {
    const { t } = useTranslation("utbetalinger");
    const { filters, setFilter } = useFilter();
    const { fraDato, mottaker, tilDato } = filters || {};

    return (
        <div className={styles.utbetalinger_filter}>
            <Fieldset legend={t("filter.dato")} className={styles.periodevelger}>
                <FilterDatePicker
                    label="filter.fra"
                    toDate={tilDato}
                    defaultSelected={fraDato}
                    onDateChange={(fraDato) => setFilter({ fraDato })}
                />
                <FilterDatePicker
                    label="filter.til"
                    fromDate={fraDato}
                    defaultSelected={tilDato}
                    onDateChange={(tilDato) => setFilter({ tilDato })}
                />
            </Fieldset>
            <RadioGroup
                value={mottaker}
                legend={t("filter.mottaker")}
                onChange={(mottaker: MottakerFilter) => setFilter({ mottaker })}
            >
                <Radio value={null}>{t("filter.alle")}</Radio>
                <Radio value="minKonto">{t("filter.minKonto")}</Radio>
                <Radio value="annenMottaker">{t("filter.annen")}</Radio>
            </RadioGroup>
        </div>
    );
};
export default UtbetalingerFilter;
