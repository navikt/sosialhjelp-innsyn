import { Alert, Button, HStack, Modal } from "@navikt/ds-react";
import { forwardRef, Ref } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { PdfPreviewDisplay } from "@components/filopplasting/new/preview/PdfPreviewDisplay";
import ImgPreview from "@components/filopplasting/new/preview/ImgPreview";

interface Props {
    onClose?: () => void;
    url: string;
    filename: string;
}

const FilePreviewModal = ({ onClose, url, filename }: Props, ref: Ref<HTMLDialogElement>) => {
    const isPdf = url.endsWith(".pdf");
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
                            <Alert variant="error">Noe gikk galt ved visning av filen.</Alert>
                        </Modal.Body>
                        <Modal.Footer>
                            <HStack justify="end">
                                <Button variant="secondary" onClick={onClose}>
                                    Lukk
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
                    <HStack justify="end" gap="4">
                        <Button variant="primary" onClick={onClose}>
                            Godkjenn jævern
                        </Button>
                        <Button variant="secondary" onClick={onClose}>
                            Lukk
                        </Button>
                    </HStack>
                </Modal.Footer>
            </ErrorBoundary>
        </Modal>
    );
};

export default forwardRef(FilePreviewModal);
