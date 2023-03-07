import {BodyLong, Heading, Modal} from "@navikt/ds-react";
import React from "react";
import styles from "./vedlegg.module.css";

const VedleggModal: React.FC<{file: File; synlig: boolean; onRequestClose: () => void}> = ({
    file,
    synlig,
    onRequestClose,
}) => {
    const fileExtension = file.name.replace(/^.*\./, "");
    const isImage = fileExtension.match(/jpe?g|png/i) !== null;

    return (
        <Modal open={synlig} onClose={() => onRequestClose()} className={styles.vedleggModal}>
            <Modal.Content>
                <Heading level="1" size="small">
                    Fil:
                </Heading>
                <BodyLong spacing>{file.name}</BodyLong>
                {isImage && <img src={URL.createObjectURL(file)} alt={file.name} />}
            </Modal.Content>
        </Modal>
    );
};

export default VedleggModal;
