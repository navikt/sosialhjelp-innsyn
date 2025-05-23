import { BodyLong, Modal } from "@navikt/ds-react";
import React from "react";
import Image from "next/image";

import styles from "./vedlegg.module.css";

interface Props {
    file: File | undefined;
    synlig: boolean;
    onRequestClose: () => void;
}

const VedleggModal = ({ file, synlig, onRequestClose }: Props) => {
    if (!file) {
        return null;
    }
    const fileExtension = file.name.replace(/^.*\./, "");
    const isImage = fileExtension.match(/jpe?g|png/i) !== null;

    return (
        <Modal
            open={synlig}
            onClose={() => onRequestClose()}
            className={styles.vedleggModal}
            header={{ heading: "Fil:" }}
        >
            <Modal.Body className="relative">
                <BodyLong spacing className={styles.filnavn}>
                    {file.name}
                </BodyLong>
                {isImage && (
                    <Image
                        fill
                        unoptimized
                        className="max-w-screen-lg block h-auto !static mt-2"
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                    />
                )}
            </Modal.Body>
        </Modal>
    );
};

export default VedleggModal;
