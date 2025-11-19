import React from "react";
import { Modal, Button, BodyLong } from "@navikt/ds-react";

interface BekreftForkastModalProps {
    open: boolean;
    onClose: () => void;
    t: (key: string) => string;
    forkastKlage: () => void;
}

const BekreftForkastModal: React.FC<BekreftForkastModalProps> = ({ open, onClose, t, forkastKlage }) => (
    <Modal
        open={open}
        onClose={onClose}
        header={{
            heading: t("forkastKlageModalOverskrift"),
            size: "small",
            closeButton: false,
        }}
        width="small"
    >
        <Modal.Body className="py-4 px-5">
            <BodyLong>{t("forkastKlageModalBeskrivelse")}</BodyLong>
        </Modal.Body>
        <Modal.Footer>
            <Button type="button" variant="danger" onClick={forkastKlage}>
                {t("forkastKlageModalBekreft")}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose}>
                {t("forkastKlageModalAvbryt")}
            </Button>
        </Modal.Footer>
    </Modal>
);

export default BekreftForkastModal;
