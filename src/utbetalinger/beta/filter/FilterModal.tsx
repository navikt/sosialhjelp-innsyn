import {Box, Button, Chips, Modal} from "@navikt/ds-react";
import React, {useState} from "react";
import {FilterIcon} from "@navikt/aksel-icons";
import {useTranslation} from "next-i18next";

import UtbetalingerFilter from "./UtbetalingerFilter";
import {MottakerFilter, useFilter} from "./FilterContext";
import useChips from "./useChips";
import styles from "./utbetalingerFilter.module.css";

const FilterModal = () => {
    const [open, setOpen] = useState(false);
    const {oppdaterFilter} = useFilter();
    const {chips, removeChip} = useChips();
    const {t} = useTranslation("utbetalinger");

    const onCancel = () => {
        oppdaterFilter({mottaker: MottakerFilter.Alle, fraDato: undefined, tilDato: undefined});
        setOpen(false);
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} icon={<FilterIcon aria-hidden />} variant="secondary">
                {t("filter.knapp")}
            </Button>
            {chips.length > 0 ? (
                <Chips className={styles.chips}>
                    {chips.map((c) => (
                        <Chips.Removable key={c.label} onClick={() => removeChip(c.filterType)}>
                            {c.label}
                        </Chips.Removable>
                    ))}
                </Chips>
            ) : (
                <Box padding="2" />
            )}
            <Modal open={open} aria-label={t("filter.aria")} onClose={() => setOpen(false)} className={styles.modal}>
                <Modal.Body className={styles.modal_content}>
                    <UtbetalingerFilter />
                    <Button onClick={() => setOpen(false)}>{t("modal.vis")}</Button>
                    <Button variant="tertiary" onClick={onCancel}>
                        {t("modal.avbryt")}
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default FilterModal;
