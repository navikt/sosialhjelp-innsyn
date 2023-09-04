import {Button, Chips, Modal} from "@navikt/ds-react";
import React, {useEffect, useState} from "react";
import {FilterIcon} from "@navikt/aksel-icons";
import UtbetalingerFilter from "./UtbetalingerFilter";
import {MottakerFilter, useFilter} from "./FilterContext";
import useChips from "./useChips";
import styles from "./utbetalingerFilter.module.css";
import {useTranslation} from "react-i18next";

const FilterModal = () => {
    const [open, setOpen] = useState(false);
    const [datePickerIsOpen, setDatePickerIsOpen] = useState(false);
    const {oppdaterFilter} = useFilter();
    const {chips, removeChip} = useChips();
    const {t} = useTranslation("utbetalinger");

    useEffect(() => {
        Modal.setAppElement("#root");
    }, []);

    const onCancel = () => {
        oppdaterFilter({mottaker: MottakerFilter.Alle, fraDato: undefined, tilDato: undefined});
        setOpen((x) => !x);
    };

    return (
        <>
            <Button onClick={() => setOpen(true)} icon={<FilterIcon aria-hidden />} variant="secondary">
                {t("filter.knapp")}
            </Button>
            <Chips className={styles.chips}>
                {chips.map((c) => (
                    <Chips.Removable key={c.label} onClick={() => removeChip(c.filterType)}>
                        {c.label}
                    </Chips.Removable>
                ))}
            </Chips>
            <Modal
                open={open}
                aria-label={t("filter.aria")}
                onClose={() => setOpen((x: boolean) => !x)}
                shouldCloseOnEsc={!datePickerIsOpen}
                className={styles.modal}
            >
                <Modal.Content className={styles.modal_content}>
                    <UtbetalingerFilter setDatePickerIsOpen={setDatePickerIsOpen} />
                    <Button onClick={() => setOpen(false)}>{t("modal.vis")}</Button>
                    <Button variant="tertiary" onClick={onCancel}>
                        {t("modal.avbryt")}
                    </Button>
                </Modal.Content>
            </Modal>
        </>
    );
};

export default FilterModal;
