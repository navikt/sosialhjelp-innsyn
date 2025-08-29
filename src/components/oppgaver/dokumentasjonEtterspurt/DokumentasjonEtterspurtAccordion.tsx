import { Accordion, BodyShort } from "@navikt/ds-react";
import React from "react";
import { useTranslations } from "next-intl";

import { OpplastingAvVedleggModal } from "../OpplastingAvVedleggModal";
import styles from "../../../styles/lists.module.css";
import oppgaveStyles from "../../oppgaver/oppgaver.module.css";
import { OppgaveElementHendelsetype, OppgaveResponse } from "../../../generated/model";
import { DokumentasjonEtterspurtResponse } from "../../../hooks/useDokumentasjonEtterspurt";

import dokumentasjonEtterspurtStyles from "./dokumentasjonetterspurt.module.css";
import { InfoOmOppgaver, MaaSendeDokTekst, NesteInnsendelsesFrist } from "./TekstBlokker";
import DokumentasjonEtterspurtView from "./DokumentasjonEtterspurtView";

function foersteInnsendelsesfrist(dokumentasjonEtterspurt: OppgaveResponse[] | undefined): Date | null {
    if (dokumentasjonEtterspurt?.length) {
        return dokumentasjonEtterspurt[0].innsendelsesfrist
            ? new Date(dokumentasjonEtterspurt[0].innsendelsesfrist)
            : null;
    }
    return null;
}

interface Props {
    dokumentasjonEtterspurt: DokumentasjonEtterspurtResponse[] | undefined;
}

export const DokumentasjonEtterspurtAccordion = (props: Props) => {
    const t = useTranslations("common");
    const brukerHarDokumentasjonEtterspurt = Boolean(props.dokumentasjonEtterspurt?.length);

    const dokumentasjonEtterspurtErFraInnsyn =
        brukerHarDokumentasjonEtterspurt &&
        props.dokumentasjonEtterspurt?.[0].oppgaveElementer[0].hendelsetype ===
            OppgaveElementHendelsetype.dokumentasjonEtterspurt;

    if (!brukerHarDokumentasjonEtterspurt) {
        return null;
    }

    return (
        <>
            <Accordion.Item defaultOpen>
                <Accordion.Header>
                    <MaaSendeDokTekst dokumentasjonEtterspurtErFraInnsyn={dokumentasjonEtterspurtErFraInnsyn} />
                    {dokumentasjonEtterspurtErFraInnsyn && (
                        <NesteInnsendelsesFrist
                            innsendelsesfrist={foersteInnsendelsesfrist(props.dokumentasjonEtterspurt)}
                        />
                    )}
                </Accordion.Header>
                <Accordion.Content>
                    <InfoOmOppgaver dokumentasjonEtterspurtErFraInnsyn={dokumentasjonEtterspurtErFraInnsyn} />
                    <BodyShort className={dokumentasjonEtterspurtStyles.lovligFormat}>
                        {t("vedlegg.lovlig_format")}
                    </BodyShort>

                    <OpplastingAvVedleggModal />
                    <ul className={styles.unorderedList}>
                        {props.dokumentasjonEtterspurt?.map((dokumentasjon: DokumentasjonEtterspurtResponse) => (
                            <li key={dokumentasjon.oppgaveId} className={oppgaveStyles.oppgaveMedSammeFrist}>
                                <DokumentasjonEtterspurtView
                                    showFrist={dokumentasjonEtterspurtErFraInnsyn}
                                    dokumentasjonEtterspurt={dokumentasjon}
                                />
                            </li>
                        ))}
                    </ul>
                </Accordion.Content>
            </Accordion.Item>
        </>
    );
};
