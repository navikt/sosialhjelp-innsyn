import { Accordion, BodyShort, Label } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";

import { logVeilederBerOmDokumentasjonkravEvent } from "../../../utils/amplitude";
import { DokumentasjonkravResponse } from "../../../generated/model";
import { OpplastingAvVedleggModal } from "../OpplastingAvVedleggModal";
import styles from "../../../styles/lists.module.css";
import VedleggSuccess from "../../filopplasting/VedleggSuccess";
import oppgaveStyles from "../oppgaver.module.css";

import DokumentasjonKravView from "./DokumentasjonKravView";

interface Props {
    dokumentasjonkrav?: DokumentasjonkravResponse[];
}

const DokumentasjonkravAccordion = (props: Props) => {
    const t = useTranslations("common");

    useEffect(() => {
        if (props.dokumentasjonkrav && props.dokumentasjonkrav.length > 0) {
            logVeilederBerOmDokumentasjonkravEvent();
        }
    }, [props.dokumentasjonkrav]);

    if (!props.dokumentasjonkrav || props.dokumentasjonkrav.length === 0) return null;

    return (
        <>
            <Accordion.Item defaultOpen>
                <Accordion.Header>
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
