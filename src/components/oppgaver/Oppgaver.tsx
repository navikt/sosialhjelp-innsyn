import React from "react";
import DokumentBinder from "../ikoner/DocumentBinder";
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
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {Accordion, BodyShort, Heading, Label, Panel} from "@navikt/ds-react";
import styled from "styled-components";
import {VilkarAccordion} from "./accordions/VilkarAccordion";

const StyledPanel = styled(Panel)`
    @media screen and (min-width: 641px) {
        padding-left: 80px;
        padding-right: 80px;
    }
`;

export const StyledAccordion = styled(Accordion)`
    .navds-accordion__header {
        border-bottom: none;
    }
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
        <>
            <StyledPanel className="panel-luft-over">
                <Heading level="2" size="medium">
                    <FormattedMessage id="oppgaver.dine_oppgaver" />
                </Heading>
            </StyledPanel>

            {skalViseLastestripe(restStatus.oppgaver, true) && (
                <StyledPanel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (skalViseOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
                    <Lastestriper linjer={1} />
                </StyledPanel>
            )}

            <IngenOppgaverPanel
                dokumentasjonEtterspurt={dokumentasjonEtterspurt}
                dokumentasjonkrav={dokumentasjonkrav}
                vilkar={vilkar}
                leserData={skalViseLastestripe(restStatus.oppgaver)}
            />

            {skalViseOppgaver && (
                <StyledPanel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (brukerHarDokumentasjonEtterspurt ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
                    {brukerHarDokumentasjonEtterspurt && (
                        <StyledAccordion>
                            <Accordion.Item>
                                <Accordion.Header
                                    onClick={() =>
                                        logButtonOrLinkClick("Dine oppgaver: Åpnet etterspørsel av dokumentasjon")
                                    }
                                >
                                    <div className="oppgaver_header">
                                        <DokumentBinder />
                                        <div>
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
                                                {dokumentasjonEtterspurtErFraInnsyn &&
                                                    antallDagerSidenFristBlePassert > 0 && (
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
                                        </div>
                                    </div>
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

                    {vilkar?.length > 0 && <VilkarAccordion vilkar={vilkar} />}

                    {dokumentasjonkrav && dokumentasjonkrav.length > 0 && (
                        <StyledAccordion>
                            <Accordion.Item>
                                <Accordion.Header
                                    onClick={() => logButtonOrLinkClick("Dine oppgaver: Åpnet dokumentasjonkrav")}
                                >
                                    <div className="oppgaver_header">
                                        <DokumentBinder />
                                        <div>
                                            <Label>
                                                <FormattedMessage id="dokumentasjonkrav.dokumentasjon_stonad" />
                                            </Label>
                                            <BodyShort>
                                                <FormattedMessage id="dokumentasjonkrav.veileder_trenger_mer" />
                                            </BodyShort>
                                        </div>
                                    </div>
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
                </StyledPanel>
            )}
            <OppgaveInformasjon dokumentasjonkrav={dokumentasjonkrav} vilkar={vilkar} />
        </>
    );
};

export default Oppgaver;
