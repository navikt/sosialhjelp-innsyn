import { BodyLong, Modal } from "@navikt/ds-react";
import React from "react";
import Image from "next/legacy/image";

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
            <Modal.Body>
                <BodyLong spacing className={styles.filnavn}>
                    {file.name}
                </BodyLong>
                {isImage && <Image src={URL.createObjectURL(file)} alt={file.name} />}
            </Modal.Body>
        </Modal>
    );
};

export default VedleggModal;
