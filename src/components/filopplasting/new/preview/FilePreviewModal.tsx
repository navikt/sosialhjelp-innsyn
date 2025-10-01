import { Alert, Button, HStack, Modal } from "@navikt/ds-react";
import { forwardRef, Ref } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslations } from "next-intl";

import { PdfPreviewDisplay } from "@components/filopplasting/new/preview/PdfPreviewDisplay";
import ImgPreview from "@components/filopplasting/new/preview/ImgPreview";

interface Props {
    onClose?: () => void;
    url: string;
    filename: string;
    isPdf: boolean;
}

const FilePreviewModal = ({ onClose, url, filename, isPdf }: Props, ref: Ref<HTMLDialogElement>) => {
    const t = useTranslations("FilePreviewModal");
    return (
        <Modal
            ref={ref}
            aria-label="Forhåndsvisning av fil"
            header={{ heading: filename, closeButton: true }}
            closeOnBackdropClick={true}
            onClose={onClose}
            width="900px"
        >
            <ErrorBoundary
                fallback={
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
                }
            >
                <Modal.Body>
                    {isPdf ? <PdfPreviewDisplay file={{ url }} width={800} /> : <ImgPreview url={url} />}
                </Modal.Body>
                <Modal.Footer>
                    <HStack justify="end">
                        <Button variant="secondary" onClick={onClose}>
                            {t("lukk")}
                        </Button>
                    </HStack>
                </Modal.Footer>
            </ErrorBoundary>
        </Modal>
    );
};

export default forwardRef(FilePreviewModal);
