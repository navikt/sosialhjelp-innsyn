import { Button, HStack, Modal, VStack } from "@navikt/ds-react";
import { forwardRef, Ref, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslations } from "next-intl";
import { logger } from "@navikt/next-logger";
import { PdfPreviewDisplay } from "@components/filopplasting/new/preview/PdfPreviewDisplay";
import ImgPreview from "@components/filopplasting/new/preview/ImgPreview";
import FilePreviewErrorBody from "@components/filopplasting/new/preview/FilePreviewErrorBody";
import PageFlipperButtons from "@components/filopplasting/new/preview/PageFlipperButtons";

interface Props {
    onClose: () => void;
    url: string;
    filename: string;
    isPdf: boolean;
}

const FilePreviewModal = ({ onClose, url, filename, isPdf }: Props, ref: Ref<HTMLDialogElement>) => {
    const t = useTranslations("FilePreviewModal");
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    return (
        <Modal
            ref={ref}
            aria-label={t("label")}
            header={{ heading: filename, closeButton: true }}
            closeOnBackdropClick={true}
            onClose={onClose}
            width="900px"
        >
            <ErrorBoundary
                fallback={<FilePreviewErrorBody onClose={onClose} />}
                onError={(error) => logger.error(`Error loading file preview: ${error}`)}
            >
                <Modal.Body>
                    {isPdf ? (
                        <PdfPreviewDisplay
                            file={{ url }}
                            width={800}
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            setNumPages={setNumPages}
                        />
                    ) : (
                        <ImgPreview url={url} filename={filename} />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <VStack gap="4">
                        {numPages && (
                            <HStack justify="end">
                                <PageFlipperButtons
                                    numPages={numPages}
                                    pageNumber={pageNumber}
                                    setPageNumber={setPageNumber}
                                />
                            </HStack>
                        )}
                        <HStack justify="end">
                            <Button variant="secondary" onClick={onClose}>
                                {t("lukk")}
                            </Button>
                        </HStack>
                    </VStack>
                </Modal.Footer>
            </ErrorBoundary>
        </Modal>
    );
};

export default forwardRef(FilePreviewModal);
