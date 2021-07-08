import React, {useState, MouseEvent} from "react";
import {FormattedMessage} from "react-intl";
import {Systemtittel, Undertittel} from "nav-frontend-typografi";
import NavFrontendModal from "nav-frontend-modal";
import Lenke from "nav-frontend-lenker";

export const OpplastingAvVedleggModal = () => {
    const [modalSynlig, setModalSynlig] = useState(false);

    const handleOnClick = (event: MouseEvent) => {
        event.preventDefault();
        setModalSynlig(true);
    };

    return (
        <>
            <Lenke href="#" onClick={handleOnClick} className="luft_over_10px luft_under_1rem lenke_uten_ramme">
                <FormattedMessage id="oppgaver.hjelp_last_opp" />
            </Lenke>
            <NavFrontendModal
                isOpen={modalSynlig}
                contentLabel="Avbryt"
                closeButton={true}
                onRequestClose={() => {
                    setModalSynlig(false);
                }}
                style={{
                    content: {
                        overflowY: "auto",
                    },
                }}
            >
                <div className="modal-innhold">
                    <Systemtittel>
                        <FormattedMessage id="oppgaver.informasjon.modal.overskrift" />
                    </Systemtittel>

                    <Undertittel>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk1.tittel" />
                    </Undertittel>
                    <p>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk1.avsnitt1" />
                    </p>
                    <p>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk1.avsnitt2" />
                    </p>
                    <p>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk1.avsnitt3" />
                    </p>

                    <Undertittel>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk2.tittel" />
                    </Undertittel>
                    <p>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk2.avsnitt1" />
                    </p>

                    <Undertittel>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk3.tittel" />
                    </Undertittel>
                    <p>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk3.avsnitt1" />
                    </p>

                    <Undertittel>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk4.tittel" />
                    </Undertittel>
                    <p>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk4.avsnitt1" />
                    </p>
                    <ul>
                        <li>
                            <FormattedMessage id="oppgaver.informasjon.modal.bolk4.liste1" />
                        </li>
                        <li>
                            <FormattedMessage id="oppgaver.informasjon.modal.bolk4.liste2" />
                        </li>
                        <li>
                            <FormattedMessage id="oppgaver.informasjon.modal.bolk4.liste3" />
                        </li>
                    </ul>
                </div>
            </NavFrontendModal>
        </>
    );
};
