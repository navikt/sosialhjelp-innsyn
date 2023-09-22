import {Accordion, BodyShort, Label} from "@navikt/ds-react";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import {useTranslation} from "next-i18next";
import React from "react";
import {DokumentasjonkravResponse} from "../../../../generated/model";
import DokumentasjonKravView from "./DokumentasjonKravView";
import {OpplastingAvVedleggModal} from "../OpplastingAvVedleggModal";
import styles from "../../../styles/lists.module.css";
import VedleggSuccess from "../../filopplasting/VedleggSuccess";
import oppgaveStyles from "../oppgaver.module.css";

interface Props {
    dokumentasjonkrav?: DokumentasjonkravResponse[];
}

const DokumentasjonkravAccordion = (props: Props) => {
    const {t} = useTranslation();

    if (!props.dokumentasjonkrav || props.dokumentasjonkrav.length === 0) return null;

    return (
        <>
            <Accordion.Item defaultOpen>
                <Accordion.Header onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet dokumentasjonkrav")}>
                    <Label as="p">{t("dokumentasjonkrav.dokumentasjon_stonad")}</Label>
                    <BodyShort>{t("dokumentasjonkrav.veileder_trenger_mer")}</BodyShort>
                </Accordion.Header>
                <Accordion.Content>
                    <OpplastingAvVedleggModal />
                    <VedleggSuccess show={false} />

                    <ul className={styles.unorderedList}>
                        {props.dokumentasjonkrav.map((krav: DokumentasjonkravResponse) => (
                            <li key={krav.dokumentasjonkravId} className={oppgaveStyles.oppgaveMedSammeFrist}>
                                <DokumentasjonKravView dokumentasjonkrav={krav} />
                            </li>
                        ))}
                    </ul>
                </Accordion.Content>
            </Accordion.Item>
        </>
    );
};

export default DokumentasjonkravAccordion;
