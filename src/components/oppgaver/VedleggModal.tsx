import {Modal} from "@navikt/ds-react";
import React from "react";

const VedleggModal: React.FC<{file: File; synlig: boolean; onRequestClose: () => void}> = ({
    file,
    synlig,
    onRequestClose,
}) => {
    const fileExtension = file.name.replace(/^.*\./, "");
    const isImage = fileExtension.match(/jpe?g|png/i) !== null;

    return (
        <Modal open={synlig} onClose={() => onRequestClose()}>
            <Modal.Content>
                <section>
                    <div className="blokk-xs">Fil: {file.name}:</div>
                    {isImage && <img style={{width: "100%"}} src={URL.createObjectURL(file)} alt={file.name} />}
                </section>
            </Modal.Content>
        </Modal>
    );
};

export default VedleggModal;
