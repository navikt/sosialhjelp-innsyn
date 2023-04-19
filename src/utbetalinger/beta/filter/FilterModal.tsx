import {Button, Chips, Modal} from "@navikt/ds-react";
import React, {useEffect, useState} from "react";
import {FilterIcon} from "@navikt/aksel-icons";
import UtbetalingerFilter from "./UtbetalingerFilter";
import {MottakerFilter, useFilter} from "./FilterContext";
import useChips from "./useChips";
import styles from "./utbetalingerFilter.module.css";

const FilterModal = () => {
    const [open, setOpen] = useState(false);
    const [datePickerIsOpen, setDatePickerIsOpen] = useState(false);
    const {oppdaterFilter} = useFilter();
    const {chips, removeChip} = useChips();

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
                Filter
            </Button>
            <>
                <Chips className={styles.chips}>
                    {chips.map((c) => (
                        <Chips.Removable key={c.label} onClick={() => removeChip(c.filterType)}>
                            {c.label}
                        </Chips.Removable>
                    ))}
                </Chips>
            </>
            <Modal
                open={open}
                aria-label="Modal demo"
                closeButton={false}
                onClose={() => (x: boolean) => !x}
                shouldCloseOnEsc={!datePickerIsOpen}
                aria-labelledby="modal-heading"
            >
                <Modal.Content>
                    <UtbetalingerFilter setDatePickerIsOpen={setDatePickerIsOpen} />
                    <Button onClick={() => setOpen(false)}>Vis treff</Button>
                    <Button variant="tertiary" onClick={onCancel}>
                        Avbryt
                    </Button>
                </Modal.Content>
            </Modal>
        </>
    );
};

export default FilterModal;
