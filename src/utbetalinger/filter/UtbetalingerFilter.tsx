import React from "react";
import { Fieldset, Radio, RadioGroup } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { MottakerFilter } from "./lib/FilterContext";
import { FilterDatePicker } from "./FilterDatePicker";
import { useFilter } from "./lib/useFilter";

const UtbetalingerFilter = () => {
    const t = useTranslations("utbetalinger");
    const { filters, setFilter } = useFilter();
    const { fraDato, mottaker, tilDato } = filters || {};

    return (
        <div className="w-fit mb-8">
            <Fieldset legend={t("filter.dato")} className="mb-8 w-min">
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
                value={mottaker ?? ""}
                legend={t("filter.mottaker.velg")}
                onChange={(mottaker: MottakerFilter | "") => setFilter({ mottaker: mottaker === "" ? null : mottaker })}
            >
                <Radio value="">{t("filter.alle")}</Radio>
                <Radio value="minKonto">{t("filter.mottaker.minKonto")}</Radio>
                <Radio value="annenMottaker">{t("filter.mottaker.annenMottaker")}</Radio>
            </RadioGroup>
        </div>
    );
};
export default UtbetalingerFilter;
