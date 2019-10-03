import React, {useEffect, useState} from "react";
import BildeModal from "../bildeModal/BildeModal";
// eslint-disable-next-line
import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const VedleggModal: React.FC<{ file: File, synlig: boolean, onRequestClose: () => void }> = ({file, synlig, onRequestClose}) => {
    const fileExtension = file.name.replace(/^.*\./, '');
    const isImage = fileExtension.match(/jpe?g|png/i) !== null;
    const isPDF = fileExtension.match(/pdf/i) !== null;
    const [numPages, setNumPages] = useState(1);
    const pageNumber = 1;
    // const [pageNumber, setPageNumber] = useState(1);

    // const onLoadPDF = (pdf: any) => {
    //     setNumPages(pdf.numPages);
    // };

    useEffect(() => {
        return () => {
            console.log('will unmount');
            setNumPages(0);
        }
    }, []);

    return (
        <BildeModal
            className="modal vedlegg_bilde_modal"
            isOpen={synlig}
            onRequestClose={() => onRequestClose()}
            closeButton={true}
            contentLabel="Vedlegg"
            shouldCloseOnOverlayClick={true}
        >
            <div style={{padding:'1rem'}}>
                Fil: {file.name}:
                <br/>
                {isImage && (
                    <img
                        style={{width: "100%"}}
                        src={ URL.createObjectURL(file)}
                        alt={file.name}
                    />
                )}
                {isPDF && (
                    <div style={{overflow: "scroll"}}>
                        <Document
                            className="vedlegg_pdf_document"
                            options={{zoom: "page-fit"}}
                            file={ URL.createObjectURL(file)}
                            onLoadSuccess={(pdf: any ) => setNumPages(pdf.numPages)}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document>
                        <p>Side {pageNumber} av {numPages}</p>
                    </div>
                )}
            </div>
        </BildeModal>

    )
};

export default VedleggModal;
