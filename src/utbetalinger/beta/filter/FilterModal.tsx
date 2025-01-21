import { Box, Button, Chips, Modal } from "@navikt/ds-react";
import React from "react";
import { FilterIcon } from "@navikt/aksel-icons";
import { useTranslation } from "next-i18next";

import UtbetalingerFilter from "./UtbetalingerFilter";
import { useFilter } from "./FilterContext";
import useChips from "./useChips";
import styles from "./utbetalingerFilter.module.css";

const FilterModal = () => {
    const { clearFilters, setFilter } = useFilter();
    const { chips } = useChips();
    const { t } = useTranslation("utbetalinger");
    const dialogRef = React.useRef<HTMLDialogElement>(null);

    const onCancel = () => {
        clearFilters();
        dialogRef.current?.close();
    };

    return (
        <>
            <Button
                onClick={() => dialogRef.current?.showModal()}
                icon={<FilterIcon aria-hidden />}
                variant="secondary"
            >
                {t("filter.knapp")}
            </Button>
            {!chips.length ? (
                <Box padding="2" />
            ) : (
                <Chips className={styles.chips}>
                    {chips.map(({ filterType, label }) => (
                        <Chips.Removable key={label} onClick={() => setFilter({ [filterType]: null })}>
                            {label}
                        </Chips.Removable>
                    ))}
                </Chips>
            )}
            <Modal ref={dialogRef} aria-label={t("filter.aria")} className={styles.modal}>
                <Modal.Body className={styles.modal_content}>
                    <UtbetalingerFilter />
                    <Button onClick={() => dialogRef.current?.close()}>{t("modal.vis")}</Button>
                    <Button variant="tertiary" onClick={onCancel}>
                        {t("modal.avbryt")}
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default FilterModal;
