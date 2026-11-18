import React, { useId } from "react";
import { TrashIcon } from "@navikt/aksel-icons";
import { Dialog, Button } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

interface BekreftForkastModalProps {
    open: boolean;
    onClose: () => void;
    forkastKlage: () => void;
    isLoading?: boolean;
}

const BekreftForkastModal: React.FC<BekreftForkastModalProps> = ({ open, onClose, forkastKlage, isLoading }) => {
    const t = useTranslations("ForkastKlageModal");
    const beskrivelseId = useId();
    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen, event) => {
                if (!nextOpen && isLoading) {
                    event.preventDefault();
                } else if (!nextOpen) {
                    onClose();
                }
            }}
        >
            <Dialog.Popup width="small" aria-describedby={beskrivelseId}>
                <Dialog.Header>
                    <Dialog.Title>{t("overskrift")}</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <Dialog.Description id={beskrivelseId}>{t("beskrivelse")}</Dialog.Description>
                </Dialog.Body>
                <Dialog.Footer>
                    <Button
                        type="button"
                        variant="secondary"
                        data-color="accent"
                        disabled={isLoading}
                        onClick={onClose}
                    >
                        {t("behold")}
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        data-color="danger"
                        icon={<TrashIcon aria-hidden />}
                        loading={isLoading}
                        onClick={forkastKlage}
                    >
                        {t("bekreft")}
                    </Button>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};

export default BekreftForkastModal;
