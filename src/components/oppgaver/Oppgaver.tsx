import React from "react";
import "./oppgaver.less";
import {DokumentasjonEtterspurt} from "../../redux/innsynsdata/innsynsdataReducer";
import Lastestriper from "../lastestriper/Lasterstriper";
import {FormattedMessage} from "react-intl";
import OppgaveInformasjon from "../vilkar/OppgaveInformasjon";
import IngenOppgaverPanel from "./IngenOppgaverPanel";
import {skalViseLastestripe} from "../../utils/restUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {Heading, Panel} from "@navikt/ds-react";
import styled from "styled-components";
import {VilkarAccordion} from "./accordions/VilkarAccordion";
import {DokumentasjonkravAccordion} from "./accordions/DokumentasjonkravAccordion";
import {DokumentasjonEtterspurtAccordion} from "./accordions/DokumentasjonEtterspurtAccordion";

const StyledPanelHeader = styled.div`
    border-bottom: 2px solid var(--navds-semantic-color-border-muted);
    padding-left: 0.75rem;
`;

const StyledPanel = styled(Panel)`
    @media screen and (min-width: 641px) {
        padding: 2rem 4.25rem;
        margin-top: 4rem;
    }
    @media screen and (max-width: 640px) {
        padding: 1rem;
        margin-top: 2rem;
`;

function foersteInnsendelsesfrist(dokumentasjonEtterspurt: null | DokumentasjonEtterspurt[]): Date | null {
    if (dokumentasjonEtterspurt === null) {
        return null;
    }
    if (dokumentasjonEtterspurt.length > 0) {
        const innsendelsesfrister = dokumentasjonEtterspurt.map(
            (dokumentasjon: DokumentasjonEtterspurt) => new Date(dokumentasjon.innsendelsesfrist!!)
        );
        return innsendelsesfrister[0];
    }
    return null;
}

export const antallDagerEtterFrist = (innsendelsesfrist: null | Date): number => {
    if (!innsendelsesfrist) {
        return 0;
    }
    let now = Math.floor(new Date().getTime() / (3600 * 24 * 1000)); //days as integer from..
    let frist = Math.floor(innsendelsesfrist.getTime() / (3600 * 24 * 1000)); //days as integer from..
    return now - frist;
};

const Oppgaver = () => {
    const {dokumentasjonkrav, vilkar, restStatus} = useSelector((state: InnsynAppState) => state.innsynsdata);

    const dokumentasjonEtterspurt = useSelector((state: InnsynAppState) => state.innsynsdata.oppgaver);

    const brukerHarDokumentasjonEtterspurt: boolean =
        dokumentasjonEtterspurt !== null && dokumentasjonEtterspurt.length > 0;
    const dokumentasjonEtterspurtErFraInnsyn: boolean =
        brukerHarDokumentasjonEtterspurt && dokumentasjonEtterspurt!![0].oppgaveElementer!![0].erFraInnsyn;
    const innsendelsesfrist = dokumentasjonEtterspurtErFraInnsyn
        ? foersteInnsendelsesfrist(dokumentasjonEtterspurt)
        : null;
    const antallDagerSidenFristBlePassert = antallDagerEtterFrist(innsendelsesfrist);
    const skalViseOppgaver = brukerHarDokumentasjonEtterspurt || dokumentasjonkrav || vilkar;

    return (
        <StyledPanel>
            <StyledPanelHeader>
                <Heading level="2" size="medium" spacing>
                    <FormattedMessage id="oppgaver.dine_oppgaver" />
                </Heading>
            </StyledPanelHeader>

            {skalViseLastestripe(restStatus.oppgaver, true) && (
                <Lastestriper linjer={1} style={{paddingTop: "1.5rem"}} />
            )}

            <IngenOppgaverPanel
                dokumentasjonEtterspurt={dokumentasjonEtterspurt}
                dokumentasjonkrav={dokumentasjonkrav}
                vilkar={vilkar}
                leserData={skalViseLastestripe(restStatus.oppgaver)}
            />
            {skalViseOppgaver && (
                <>
                    {brukerHarDokumentasjonEtterspurt && (
                        <DokumentasjonEtterspurtAccordion
                            dokumentasjonEtterspurtErFraInnsyn={dokumentasjonEtterspurtErFraInnsyn}
                            antallDagerSidenFristBlePassert={antallDagerSidenFristBlePassert}
                            innsendelsesfrist={innsendelsesfrist}
                            restStatus_oppgaver={restStatus.oppgaver}
                            dokumentasjonEtterspurt={dokumentasjonEtterspurt}
                        />
                    )}

                    {vilkar?.length > 0 && <VilkarAccordion vilkar={vilkar} />}

                    {dokumentasjonkrav?.length > 0 && (
                        <DokumentasjonkravAccordion dokumentasjonkrav={dokumentasjonkrav} />
                    )}
                </>
            )}
            <OppgaveInformasjon dokumentasjonkrav={dokumentasjonkrav} vilkar={vilkar} />
        </StyledPanel>
    );
};

export default Oppgaver;
