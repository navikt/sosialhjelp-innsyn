import { useMemo, useState } from "react";
import { Document, DocumentProps, Page, PageProps, pdfjs } from "react-pdf";
import { Box } from "@navikt/ds-react";

import { PageFlipperButtons } from "@components/filopplasting/new/preview/PageFlipperButtons";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
/**
 * Display a PDF file. Grows vertically to fit the container.
 *
 * @param file - The PDF file to display.
 * @param width - The width of the displayed PDF in pixels.
 * @throws {PdfEncryptionError} - If the PDF is encrypted.
 * @throws {PdfLoadError} - If the PDF fails to load.
 */
export const PdfPreviewDisplay = ({ file, width }: Pick<DocumentProps, "file"> & Pick<PageProps, "width">) => {
    const [numPages, setNumPages] = useState<number>();
    const [pageNumber, setPageNumber] = useState<number>(1);
    const memoedFile = useMemo(() => file, [file]);
    // Use a modal-friendly default width if not provided
    const pageWidth = width ?? 500;
    return (
        <Box.New maxWidth="800px" maxHeight="70vh" padding="4" position="relative">
            <Document
                file={memoedFile}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(error) => {
                    if (error.name === "PasswordException") throw new Error();
                    throw new Error("PDF load error", { cause: error });
                }}
                onSourceError={(error) => {
                    throw new Error("PDF source error", { cause: error });
                }}
                onPassword={(_) => {
                    // Throwing an error here will cause onLoadError to receive a PasswordException.
                    throw new Error();
                }}
            >
                <PageFlipperButtons numPages={numPages} pageNumber={pageNumber} setPageNumber={setPageNumber} />
                <Page width={pageWidth} pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>
        </Box.New>
    );
};
