import {Accordion} from "@navikt/ds-react";
import {logButtonOrLinkClick} from "../../../utils/amplitude";
import {OpplastingAvVedleggModal} from "../OpplastingAvVedleggModal";
import DriftsmeldingVedlegg from "../../driftsmelding/DriftsmeldingVedlegg";
import {REST_STATUS} from "../../../utils/restUtils";
import {DokumentasjonEtterspurt, HendelseTypeEnum} from "../../../redux/innsynsdata/innsynsdataReducer";
import DokumentasjonEtterspurtView from "./DokumentasjonEtterspurtView";
import React from "react";
import {InfoOmOppgaver, MaaSendeDokTekst, NesteInnsendelsesFrist} from "./TekstBlokker";
import styles from "../../../styles/lists.module.css";

function foersteInnsendelsesfrist(dokumentasjonEtterspurt: DokumentasjonEtterspurt[]): Date | null {
    if (dokumentasjonEtterspurt.length > 0) {
        return dokumentasjonEtterspurt[0].innsendelsesfrist
            ? new Date(dokumentasjonEtterspurt[0].innsendelsesfrist)
            : null;
    }
    return null;
}

interface Props {
    restStatus_oppgaver: REST_STATUS;
    dokumentasjonEtterspurt: DokumentasjonEtterspurt[];
}

export const DokumentasjonEtterspurtAccordion = (props: Props) => {
    const brukerHarDokumentasjonEtterspurt = props.dokumentasjonEtterspurt?.length > 0;
    if (!brukerHarDokumentasjonEtterspurt) {
        return null;
    }
    const dokumentasjonEtterspurtErFraInnsyn =
        props.dokumentasjonEtterspurt[0].oppgaveElementer[0].hendelsetype === HendelseTypeEnum.DOKUMENTASJON_ETTERSPURT;

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
                    <DriftsmeldingVedlegg
                        restStatusError={
                            props.restStatus_oppgaver !== REST_STATUS.INITIALISERT &&
                            props.restStatus_oppgaver !== REST_STATUS.PENDING
                        }
                    />
                    <ul className={styles.unorderedList}>
                        {props.dokumentasjonEtterspurt.map((dokumentasjon: DokumentasjonEtterspurt, index: number) => (
                            <li key={dokumentasjon.oppgaveId}>
                                <DokumentasjonEtterspurtView
                                    dokumentasjonEtterspurt={dokumentasjon}
                                    oppgaverErFraInnsyn={dokumentasjonEtterspurtErFraInnsyn}
                                    oppgaveIndex={index}
                                />
                            </li>
                        ))}
                    </ul>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
