import React from "react";
import { Modal, Button, BodyLong } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

interface BekreftForkastModalProps {
    open: boolean;
    onClose: () => void;
    forkastKlage: () => void;
}

const BekreftForkastModal: React.FC<BekreftForkastModalProps> = ({ open, onClose, forkastKlage }) => {
    const t = useTranslations("ForkastKlageModal");
    return (
        <Modal
            open={open}
            onClose={onClose}
            header={{
                heading: t("overskrift"),
                size: "small",
                closeButton: false,
            }}
            width="small"
        >
            <Modal.Body className="py-4 px-5">
                <BodyLong>{t("beskrivelse")}</BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="danger" onClick={forkastKlage}>
                    {t("bekreft")}
                </Button>
                <Button type="button" variant="secondary" onClick={onClose}>
                    {t("avbryt")}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default BekreftForkastModal;
