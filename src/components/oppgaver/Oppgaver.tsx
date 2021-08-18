import Panel from "nav-frontend-paneler";
import {Element, Normaltekst, Systemtittel} from "nav-frontend-typografi";
import React from "react";
import DokumentBinder from "../ikoner/DocumentBinder";
import "./oppgaver.less";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
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
            <Panel className="panel-luft-over">
                <Systemtittel>
                    <FormattedMessage id="oppgaver.dine_oppgaver" />
                </Systemtittel>
            </Panel>

            <OppgaveInformasjon />

            {skalViseLastestripe(restStatus.oppgaver) && (
                <Panel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (skalViseOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
                    <Lastestriper linjer={1} />
                </Panel>
            )}

            <IngenOppgaverPanel
                dokumentasjonEtterspurt={dokumentasjonEtterspurt}
                dokumentasjonkrav={dokumentasjonkrav}
                vilkar={vilkar}
                leserData={skalViseLastestripe(restStatus.oppgaver)}
            />

            {skalViseOppgaver && (
                <Panel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (brukerHarDokumentasjonEtterspurt ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
                    {brukerHarDokumentasjonEtterspurt && (
                        <Ekspanderbartpanel
                            apen={false}
                            border={false}
                            onClick={() => logButtonOrLinkClick("Åpnet etterspørsel av dokumentasjon")}
                            tittel={
                                <div className="oppgaver_header">
                                    <DokumentBinder />
                                    <div>
                                        <Element>
                                            {dokumentasjonEtterspurtErFraInnsyn && (
                                                <FormattedMessage id="oppgaver.maa_sende_dok_veileder" />
                                            )}
                                            {!dokumentasjonEtterspurtErFraInnsyn && (
                                                <FormattedMessage id="oppgaver.maa_sende_dok" />
                                            )}
                                        </Element>
                                        <Normaltekst>
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
                                        </Normaltekst>
                                    </div>
                                </div>
                            }
                        >
                            {dokumentasjonEtterspurtErFraInnsyn ? (
                                <Normaltekst>
                                    <FormattedMessage id="oppgaver.veileder_trenger_mer" />
                                </Normaltekst>
                            ) : (
                                <Normaltekst>
                                    <FormattedMessage id="oppgaver.last_opp_vedlegg_ikke" />
                                </Normaltekst>
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
                        </Ekspanderbartpanel>
                    )}

                    {vilkar && vilkar.length > 0 && (
                        <Ekspanderbartpanel
                            apen={false}
                            border={false}
                            tittel={
                                <div className="oppgaver_header">
                                    <DokumentBinder />
                                    <div>
                                        <Element>{<FormattedMessage id="vilkar.du_har_vilkar" />}</Element>
                                        <Normaltekst>
                                            <FormattedMessage
                                                id="vilkar.veileder_trenger_mer"
                                                values={{
                                                    antallVilkar: vilkar.length,
                                                }}
                                            />
                                        </Normaltekst>
                                    </div>
                                </div>
                            }
                        >
                            <div>
                                {vilkar.map((vilkarElement, index) => (
                                    <VilkarView key={index} vilkar={vilkarElement} />
                                ))}
                            </div>
                        </Ekspanderbartpanel>
                    )}

                    {dokumentasjonkrav && dokumentasjonkrav.length > 0 && (
                        <Ekspanderbartpanel
                            apen={false}
                            border={false}
                            tittel={
                                <div className="oppgaver_header">
                                    <DokumentBinder />
                                    <div>
                                        <Element>
                                            <FormattedMessage id="dokumentasjonkrav.dokumentasjon_stonad" />
                                        </Element>
                                        <Normaltekst>
                                            <FormattedMessage
                                                id="dokumentasjonkrav.veileder_trenger_mer"
                                                values={{
                                                    antallDokumenter: dokumentasjonkrav.reduce(
                                                        (count, dokumenter) =>
                                                            count + dokumenter.dokumentasjonkravElementer.length,
                                                        0
                                                    ),
                                                }}
                                            />
                                        </Normaltekst>
                                    </div>
                                </div>
                            }
                        >
                            <div>
                                {dokumentasjonkrav.map((krav: DokumentasjonKrav, index: number) => (
                                    <DokumentasjonKravView
                                        dokumentasjonkrav={krav}
                                        key={index}
                                        dokumentasjonkravIndex={index}
                                    />
                                ))}
                            </div>
                        </Ekspanderbartpanel>
                    )}
                </Panel>
            )}
        </>
    );
};

export default Oppgaver;
