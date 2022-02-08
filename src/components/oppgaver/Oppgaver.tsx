import React from "react";
import "./oppgaver.less";
import DokumentasjonEtterspurtView from "./DokumentasjonEtterspurtView";
import {DokumentasjonEtterspurt, DokumentasjonKrav} from "../../redux/innsynsdata/innsynsdataReducer";
import Lastestriper from "../lastestriper/Lasterstriper";
import {FormattedMessage} from "react-intl";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";
import OppgaveInformasjon from "../vilkar/OppgaveInformasjon";
import IngenOppgaverPanel from "./IngenOppgaverPanel";
import {formatDato} from "../../utils/formatting";
import {OpplastingAvVedleggModal} from "./OpplastingAvVedleggModal";
import {skalViseLastestripe} from "../../utils/restUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import DokumentasjonKravView from "./DokumentasjonKravView";
import {VilkarView} from "./VilkarView";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Accordion, BodyShort, Heading, Label, Panel} from "@navikt/ds-react";
import styled from "styled-components";

const StyledPanel = styled(Panel)`
    @media screen and (min-width: 641px) {
        padding-left: 80px;
        padding-right: 80px;
        margin-top: 4rem;
    }
    @media screen and (max-width: 640px) {
        padding: 1rem;
    }
`;

const StyledHeader = styled.div`
    padding-top: 4px;
`;

const StyledAccordion = styled(Accordion)`
    .navds-accordion__header {
        padding-left: 0;
    }
    .navds-accordion__content {
        padding-left: 0;
    }
`;

const StyledOppgaveHeader = styled.div`
    border-bottom: 2px solid #a0a0a0;
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

function getAntallDagerTekst(antallDagerSidenFristBlePassert: number): string {
    return antallDagerSidenFristBlePassert > 1
        ? antallDagerSidenFristBlePassert + " dager"
        : antallDagerSidenFristBlePassert + " dag";
}

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
            <StyledOppgaveHeader>
                <Heading level="2" size="medium">
                    <FormattedMessage id="oppgaver.dine_oppgaver" />
                </Heading>
            </StyledOppgaveHeader>

            {skalViseLastestripe(restStatus.oppgaver, true) && <Lastestriper linjer={1} />}

            <IngenOppgaverPanel
                dokumentasjonEtterspurt={dokumentasjonEtterspurt}
                dokumentasjonkrav={dokumentasjonkrav}
                vilkar={vilkar}
                leserData={skalViseLastestripe(restStatus.oppgaver)}
            />
            {skalViseOppgaver && (
                <>
                    {brukerHarDokumentasjonEtterspurt && (
                        <StyledAccordion>
                            <Accordion.Item>
                                <Accordion.Header
                                    onClick={() =>
                                        logButtonOrLinkClick("Dine oppgaver: Åpnet etterspørsel av dokumentasjon")
                                    }
                                >
                                    <StyledHeader>
                                        <Label>
                                            {dokumentasjonEtterspurtErFraInnsyn && (
                                                <FormattedMessage id="oppgaver.maa_sende_dok_veileder" />
                                            )}
                                            {!dokumentasjonEtterspurtErFraInnsyn && (
                                                <FormattedMessage id="oppgaver.maa_sende_dok" />
                                            )}
                                        </Label>
                                        <BodyShort>
                                            {dokumentasjonEtterspurtErFraInnsyn &&
                                                antallDagerSidenFristBlePassert <= 0 && (
                                                    <FormattedMessage
                                                        id="oppgaver.neste_frist"
                                                        values={{
                                                            innsendelsesfrist:
                                                                innsendelsesfrist != null
                                                                    ? formatDato(innsendelsesfrist.toISOString())
                                                                    : "",
                                                        }}
                                                    />
                                                )}
                                            {dokumentasjonEtterspurtErFraInnsyn && antallDagerSidenFristBlePassert > 0 && (
                                                <FormattedMessage
                                                    id="oppgaver.neste_frist_passert"
                                                    values={{
                                                        antall_dager: getAntallDagerTekst(
                                                            antallDagerSidenFristBlePassert
                                                        ),
                                                        innsendelsesfrist:
                                                            innsendelsesfrist != null
                                                                ? formatDato(innsendelsesfrist!.toISOString())
                                                                : "",
                                                    }}
                                                />
                                            )}
                                        </BodyShort>
                                    </StyledHeader>
                                </Accordion.Header>
                                <Accordion.Content>
                                    {dokumentasjonEtterspurtErFraInnsyn ? (
                                        <BodyShort>
                                            <FormattedMessage id="oppgaver.veileder_trenger_mer" />
                                        </BodyShort>
                                    ) : (
                                        <BodyShort>
                                            <FormattedMessage id="oppgaver.last_opp_vedlegg_ikke" />
                                        </BodyShort>
                                    )}

                                    <OpplastingAvVedleggModal />

                                    <DriftsmeldingVedlegg leserData={skalViseLastestripe(restStatus.oppgaver)} />

                                    <div>
                                        {dokumentasjonEtterspurt !== null &&
                                            dokumentasjonEtterspurt.map(
                                                (dokumentasjon: DokumentasjonEtterspurt, index: number) => (
                                                    <DokumentasjonEtterspurtView
                                                        dokumentasjonEtterspurt={dokumentasjon}
                                                        key={index}
                                                        oppgaverErFraInnsyn={dokumentasjonEtterspurtErFraInnsyn}
                                                        oppgaveIndex={index}
                                                    />
                                                )
                                            )}
                                    </div>
                                </Accordion.Content>
                            </Accordion.Item>
                        </StyledAccordion>
                    )}

                    {vilkar && vilkar.length > 0 && (
                        <StyledAccordion>
                            <Accordion.Item>
                                <Accordion.Header onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet vilkår")}>
                                    <StyledHeader>
                                        <Label>{<FormattedMessage id="vilkar.du_har_vilkar" />}</Label>
                                        <BodyShort>
                                            <FormattedMessage id="vilkar.veileder_trenger_mer" />
                                        </BodyShort>
                                    </StyledHeader>
                                </Accordion.Header>
                                <Accordion.Content>
                                    {vilkar.map((vilkarElement, index) => (
                                        <VilkarView key={index} vilkar={vilkarElement} />
                                    ))}
                                </Accordion.Content>
                            </Accordion.Item>
                        </StyledAccordion>
                    )}

                    {dokumentasjonkrav && dokumentasjonkrav.length > 0 && (
                        <StyledAccordion>
                            <Accordion.Item>
                                <Accordion.Header
                                    onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet dokumentasjonkrav")}
                                >
                                    <StyledHeader>
                                        <Label>
                                            <FormattedMessage id="dokumentasjonkrav.dokumentasjon_stonad" />
                                        </Label>
                                        <BodyShort>
                                            <FormattedMessage id="dokumentasjonkrav.veileder_trenger_mer" />
                                        </BodyShort>
                                    </StyledHeader>
                                </Accordion.Header>
                                <Accordion.Content>
                                    {dokumentasjonkrav.map((krav: DokumentasjonKrav, index: number) => (
                                        <DokumentasjonKravView
                                            dokumentasjonkrav={krav}
                                            key={index}
                                            dokumentasjonkravIndex={index}
                                        />
                                    ))}
                                </Accordion.Content>
                            </Accordion.Item>
                        </StyledAccordion>
                    )}
                </>
            )}
            <OppgaveInformasjon dokumentasjonkrav={dokumentasjonkrav} vilkar={vilkar} />
        </StyledPanel>
    );
};

export default Oppgaver;
