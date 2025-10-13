import { useMemo } from "react";
import { Document, DocumentProps, Page, PageProps, pdfjs } from "react-pdf";
import { Box } from "@navikt/ds-react";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

interface Props {
    pageNumber: number;
    setPageNumber: (number: number) => void;
    setNumPages: (numPages: number) => void;
}

export const PdfPreviewDisplay = ({
    file,
    width,
    setNumPages,
    pageNumber,
}: Pick<DocumentProps, "file"> & Pick<PageProps, "width"> & Props) => {
    const memoedFile = useMemo(() => file, [file]);
    // Use a modal-friendly default width if not provided
    const pageWidth = width ?? 500;
    return (
        <>
            <Box.New maxWidth="800px" minHeight="70vh" maxHeight="70vh" padding="4" position="relative">
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
                    <Page
                        width={pageWidth}
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                </Document>
            </Box.New>
        </>
    );
};
