import React, {MouseEvent, useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {BodyShort, Heading, Link, Modal} from "@navikt/ds-react";
import styled from "styled-components";
import styles from "./oppgaver.module.css";

const StyledModal = styled(Modal)`
    max-width: 600px;
    padding: 3rem 2rem;
`;

export const OpplastingAvVedleggModal = () => {
    const [modalSynlig, setModalSynlig] = useState(false);
    const {t} = useTranslation();

    const handleOnClick = (event: MouseEvent) => {
        event.preventDefault();
        setModalSynlig(true);
    };

    return (
        <>
            <Link href="#" onClick={handleOnClick} className={styles.lastOppHjelp}>
                {t("oppgaver.hjelp_last_opp")}
            </Link>
            <StyledModal
                open={modalSynlig}
                onClose={() => {
                    setModalSynlig(false);
                }}
                header={{heading: t("oppgaver.informasjon.modal.overskrift")}}
            >
                <Modal.Body>
                    <Heading level="3" size="small" spacing>
                        {t("oppgaver.informasjon.modal.bolk1.tittel")}
                    </Heading>
                    <BodyShort spacing>{t("oppgaver.informasjon.modal.bolk1.avsnitt1")}</BodyShort>

                    <Heading level="3" size="small" spacing>
                        {t("oppgaver.informasjon.modal.bolk2.tittel")}
                    </Heading>
                    <BodyShort spacing>{t("oppgaver.informasjon.modal.bolk2.avsnitt1")}</BodyShort>

                    <Heading level="3" size="small" spacing>
                        {t("oppgaver.informasjon.modal.bolk3.tittel")}
                    </Heading>
                    <BodyShort spacing>{t("oppgaver.informasjon.modal.bolk3.avsnitt1")}</BodyShort>

                    <Heading level="3" size="small" spacing>
                        {t("oppgaver.informasjon.modal.bolk4.tittel")}
                    </Heading>
                    <BodyShort spacing>{t("oppgaver.informasjon.modal.bolk4.avsnitt1")}</BodyShort>
                    <ul>

                    </ul>
                </Modal.Body>
            </StyledModal>
        </>
    );
};
