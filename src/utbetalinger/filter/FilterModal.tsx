import { Button, Modal } from "@navikt/ds-react";
import React from "react";
import { FilterIcon } from "@navikt/aksel-icons";
import { useTranslation } from "next-i18next";

import UtbetalingerFilter from "./UtbetalingerFilter";
import { FilterChips } from "./FilterChips";
import { useFilter } from "./lib/useFilter";

const FilterModal = () => {
    const { clearFilters } = useFilter();
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
            <FilterChips />
            <Modal ref={dialogRef} aria-label={t("filter.aria")}>
                <Modal.Body className="py-4 px-5">
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
