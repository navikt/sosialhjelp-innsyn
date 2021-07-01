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
import VilkarView from "../vilkar/VilkarView";
import IngenOppgaverPanel from "./IngenOppgaverPanel";
import {formatDato} from "../../utils/formatting";
import {OpplastingAvVedleggModal} from "./OpplastingAvVedleggModal";
import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import DokumentasjonKravView from "./DokumentasjonKravView";

interface Props {
    oppgaver: null | DokumentasjonEtterspurt[];
    restStatus: REST_STATUS;
}

function foersteInnsendelsesfrist(oppgaver: null | DokumentasjonEtterspurt[]): Date | null {
    if (oppgaver === null) {
        return null;
    }
    if (oppgaver.length > 0) {
        const innsendelsesfrister = oppgaver.map(
            (oppgave: DokumentasjonEtterspurt) => new Date(oppgave.innsendelsesfrist!!)
        );
        return innsendelsesfrister[0];
    }
    return null;
}

const nextInnsedelsesfrist = (dokumentasjonkrav: DokumentasjonKrav[]): Date => {
    return dokumentasjonkrav
        .filter((dokumentasjonkrav) => dokumentasjonkrav.frist)
        .map((dokumentasjonKrav: DokumentasjonKrav) => new Date(dokumentasjonKrav.frist!!))[0];
};

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

const Oppgaver: React.FC<Props> = ({oppgaver, restStatus}) => {
    const dokumentasjonKrav: DokumentasjonKrav[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.dokumentasjonkrav
    );

    const brukerHarOppgaver: boolean = oppgaver !== null && oppgaver.length > 0;
    const oppgaverErFraInnsyn: boolean = brukerHarOppgaver && oppgaver!![0].oppgaveElementer!![0].erFraInnsyn;
    const innsendelsesfrist = oppgaverErFraInnsyn ? foersteInnsendelsesfrist(oppgaver) : null;
    const antallDagerSidenFristBlePassert = antallDagerEtterFrist(innsendelsesfrist);
    const dokumentasjonkravFrist = nextInnsedelsesfrist(dokumentasjonKrav);
    const daysSinceDokumentasjonkravFrist = antallDagerEtterFrist(dokumentasjonkravFrist);

    return (
        <>
            <Panel className="panel-luft-over">
                <Systemtittel>
                    <FormattedMessage id="oppgaver.dine_oppgaver" />
                </Systemtittel>
            </Panel>

            <VilkarView />

            {skalViseLastestripe(restStatus) && (
                <Panel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
                    <Lastestriper linjer={1} />
                </Panel>
            )}

            <IngenOppgaverPanel leserData={skalViseLastestripe(restStatus)} />

            {(brukerHarOppgaver || dokumentasjonKrav) && (
                <Panel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
                    {brukerHarOppgaver && (
                        <Ekspanderbartpanel
                            apen={false}
                            border={false}
                            tittel={
                                <div className="oppgaver_header">
                                    <DokumentBinder />
                                    <div>
                                        <Element>
                                            {oppgaverErFraInnsyn && (
                                                <FormattedMessage id="oppgaver.maa_sende_dok_veileder" />
                                            )}
                                            {!oppgaverErFraInnsyn && <FormattedMessage id="oppgaver.maa_sende_dok" />}
                                        </Element>
                                        <Normaltekst>
                                            {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert <= 0 && (
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
                                            {oppgaverErFraInnsyn && antallDagerSidenFristBlePassert > 0 && (
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
                            {oppgaverErFraInnsyn ? (
                                <Normaltekst>
                                    <FormattedMessage id="oppgaver.veileder_trenger_mer" />
                                </Normaltekst>
                            ) : (
                                <Normaltekst>
                                    <FormattedMessage id="oppgaver.last_opp_vedlegg_ikke" />
                                </Normaltekst>
                            )}

                            <OpplastingAvVedleggModal />

                            <DriftsmeldingVedlegg leserData={skalViseLastestripe(restStatus)} />

                            <div>
                                {oppgaver !== null &&
                                    oppgaver.map((oppgave: DokumentasjonEtterspurt, oppgaveIndex: number) => (
                                        <DokumentasjonEtterspurtView
                                            dokumentasjonEtterspurt={oppgave}
                                            key={oppgaveIndex}
                                            oppgaverErFraInnsyn={oppgaverErFraInnsyn}
                                            oppgaveIndex={oppgaveIndex}
                                        />
                                    ))}
                            </div>
                        </Ekspanderbartpanel>
                    )}

                    {dokumentasjonKrav && (
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
                                            {dokumentasjonkravFrist && daysSinceDokumentasjonkravFrist <= 0 && (
                                                <FormattedMessage
                                                    id="oppgaver.neste_frist"
                                                    values={{
                                                        innsendelsesfrist: formatDato(
                                                            dokumentasjonkravFrist.toISOString()
                                                        ),
                                                    }}
                                                />
                                            )}
                                            {daysSinceDokumentasjonkravFrist > 0 && (
                                                <FormattedMessage
                                                    id="oppgaver.neste_frist_passert"
                                                    values={{
                                                        antall_dager: getAntallDagerTekst(
                                                            antallDagerEtterFrist(dokumentasjonkravFrist)
                                                        ),
                                                        innsendelsesfrist: formatDato(
                                                            dokumentasjonkravFrist!.toISOString()
                                                        ),
                                                    }}
                                                />
                                            )}
                                        </Normaltekst>
                                    </div>
                                </div>
                            }
                        >
                            <Normaltekst>
                                <FormattedMessage
                                    id="dokumentasjonkrav.veileder_trenger_mer"
                                    values={{
                                        antallDokumenter: dokumentasjonKrav.reduce(
                                            (count, dokumenter) => count + dokumenter.dokumentasjonkravElementer.length,
                                            0
                                        ),
                                    }}
                                />
                            </Normaltekst>
                            <div>
                                {dokumentasjonKrav.map((dokumentasjonKrav: DokumentasjonKrav, index: number) => (
                                    <DokumentasjonKravView
                                        dokumentasjonkrav={dokumentasjonKrav}
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
