import { Alert, Button, HStack, Modal } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

interface Props {
    onClose: () => void;
}

const FilePreviewErrorBody = ({ onClose }: Props) => {
    const t = useTranslations("FilePreviewErrorBody");
    return (
        <>
            <Modal.Body>
                <Alert variant="error">{t("error")}</Alert>
            </Modal.Body>
            <Modal.Footer>
                <HStack justify="end">
                    <Button variant="secondary" onClick={onClose}>
                        {t("lukk")}
                    </Button>
                </HStack>
            </Modal.Footer>
        </>
    );
};

export default FilePreviewErrorBody;
