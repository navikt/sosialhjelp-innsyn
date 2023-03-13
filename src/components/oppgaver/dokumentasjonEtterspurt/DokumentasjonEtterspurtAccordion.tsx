import {Accordion} from "@navikt/ds-react";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import {OpplastingAvVedleggModal} from "../OpplastingAvVedleggModal";
import DriftsmeldingVedlegg from "../../driftsmelding/DriftsmeldingVedlegg";
import DokumentasjonEtterspurtView from "./DokumentasjonEtterspurtView";
import React from "react";
import {InfoOmOppgaver, MaaSendeDokTekst, NesteInnsendelsesFrist} from "./TekstBlokker";
import styles from "../../../styles/lists.module.css";
import {OppgaveElementHendelsetype, OppgaveResponse} from "../../../generated/model";

function foersteInnsendelsesfrist(dokumentasjonEtterspurt: OppgaveResponse[] | undefined): Date | null {
    if (dokumentasjonEtterspurt?.length) {
        return dokumentasjonEtterspurt[0].innsendelsesfrist
            ? new Date(dokumentasjonEtterspurt[0].innsendelsesfrist)
            : null;
    }
    return null;
}

interface Props {
    isLoading: boolean;
    dokumentasjonEtterspurt: OppgaveResponse[] | undefined;
}

export const DokumentasjonEtterspurtAccordion = (props: Props) => {
    const brukerHarDokumentasjonEtterspurt = Boolean(props.dokumentasjonEtterspurt?.length);
    if (!brukerHarDokumentasjonEtterspurt) {
        return null;
    }
    const dokumentasjonEtterspurtErFraInnsyn =
        props.dokumentasjonEtterspurt?.[0].oppgaveElementer[0].hendelsetype ===
        OppgaveElementHendelsetype.dokumentasjonEtterspurt;

    return (
        <Accordion>
            <Accordion.Item defaultOpen>
                <Accordion.Header
                    onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet etterspørsel av dokumentasjon")}
                >
                    <MaaSendeDokTekst dokumentasjonEtterspurtErFraInnsyn={dokumentasjonEtterspurtErFraInnsyn} />
                    {dokumentasjonEtterspurtErFraInnsyn && (
                        <NesteInnsendelsesFrist
                            innsendelsesfrist={foersteInnsendelsesfrist(props.dokumentasjonEtterspurt)}
                        />
                    )}
                </Accordion.Header>
                <Accordion.Content>
                    <InfoOmOppgaver dokumentasjonEtterspurtErFraInnsyn={dokumentasjonEtterspurtErFraInnsyn} />
                    <OpplastingAvVedleggModal />
                    <DriftsmeldingVedlegg leserData={props.isLoading} />
                    <ul className={styles.unorderedList}>
                        {props.dokumentasjonEtterspurt?.map((dokumentasjon: OppgaveResponse, index: number) => (
                            <li key={index}>
                                <DokumentasjonEtterspurtView
                                    showFrist={dokumentasjonEtterspurtErFraInnsyn}
                                    dokumentasjonEtterspurt={dokumentasjon}
                                />
                            </li>
                        ))}
                    </ul>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
