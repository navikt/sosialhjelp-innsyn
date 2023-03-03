import React, {MouseEvent, useEffect, useState} from "react";
import {FormattedMessage} from "react-intl";
import {BodyShort, Heading, Link, Modal} from "@navikt/ds-react";
import styled from "styled-components";

const StyledModal = styled(Modal)`
    max-width: 600px;
    padding: 3rem 2rem;
`;

export const OpplastingAvVedleggModal = () => {
    const [modalSynlig, setModalSynlig] = useState(false);

    useEffect(() => {
        Modal.setAppElement("#root");
    }, []);

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
                    <Heading level="2" size="medium" spacing>
                        <FormattedMessage id="oppgaver.informasjon.modal.overskrift" />
                    </Heading>

                    <Heading level="3" size="small" spacing>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk1.tittel" />
                    </Heading>
                    <BodyShort spacing>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk1.avsnitt1" />
                    </BodyShort>
                    <BodyShort spacing>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk1.avsnitt2" />
                    </BodyShort>
                    <BodyShort spacing>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk1.avsnitt3" />
                    </BodyShort>

                    <Heading level="3" size="small" spacing>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk2.tittel" />
                    </Heading>
                    <BodyShort spacing>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk2.avsnitt1" />
                    </BodyShort>

                    <Heading level="3" size="small" spacing>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk3.tittel" />
                    </Heading>
                    <BodyShort spacing>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk3.avsnitt1" />
                    </BodyShort>

                    <Heading level="3" size="small" spacing>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk4.tittel" />
                    </Heading>
                    <BodyShort spacing>
                        <FormattedMessage id="oppgaver.informasjon.modal.bolk4.avsnitt1" />
                    </BodyShort>
                    <ul>
                        <li>
                            <BodyShort>
                                <FormattedMessage id="oppgaver.informasjon.modal.bolk4.liste1" />
                            </BodyShort>
                        </li>
                        <li>
                            <BodyShort>
                                <FormattedMessage id="oppgaver.informasjon.modal.bolk4.liste2" />
                            </BodyShort>
                        </li>
                        <li>
                            <BodyShort>
                                <FormattedMessage id="oppgaver.informasjon.modal.bolk4.liste3" />
                            </BodyShort>
                        </li>
                    </ul>
                </Modal.Content>
            </StyledModal>
        </>
    );
};
