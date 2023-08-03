import {BodyLong, Heading, Modal} from "@navikt/ds-react";
import React from "react";
import styles from "./vedlegg.module.css";
import Image from "next/image";

const VedleggModal: React.FC<{file: File | null; synlig: boolean; onRequestClose: () => void}> = ({
    file,
    synlig,
    onRequestClose,
}) => {
    if (!file) {
        return null;
    }
    const fileExtension = file.name.replace(/^.*\./, "");
    const isImage = fileExtension.match(/jpe?g|png/i) !== null;

    return (
        <Modal open={synlig} onClose={() => onRequestClose()} className={styles.vedleggModal}>
            <Modal.Content>
                <Heading level="1" size="small">
                    Fil:
                </Heading>
                <BodyLong spacing className={styles.filnavn}>
                    {file.name}
                </BodyLong>
                {isImage && <Image src={URL.createObjectURL(file)} alt={file.name} />}
            </Modal.Content>
        </Modal>
    );
};

export default VedleggModal;
