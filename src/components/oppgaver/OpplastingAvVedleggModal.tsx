import React, {useState, MouseEvent} from "react";
import {FormattedMessage} from "react-intl";
import {Systemtittel, Undertittel} from "nav-frontend-typografi";
import {Link, Modal} from "@navikt/ds-react";
import styled from "styled-components";

const StyledModal = styled(Modal)`
    max-width: 600px;
    padding: 3rem 2rem;
`;

export const OpplastingAvVedleggModal = () => {
    const [modalSynlig, setModalSynlig] = useState(false);

    const handleOnClick = (event: MouseEvent) => {
        event.preventDefault();
        setModalSynlig(true);
    };

    return (
        <>
            <Link href="#" onClick={handleOnClick} className="luft_over_10px luft_under_1rem">
                <FormattedMessage id="oppgaver.hjelp_last_opp" />
            </Link>
            <StyledModal
                open={modalSynlig}
                onClose={() => {
                    setModalSynlig(false);
                }}
            >
                <Modal.Content>
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
                </Modal.Content>
            </StyledModal>
        </>
    );
};
