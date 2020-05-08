import {Panel} from "nav-frontend-paneler";
import {Element, Normaltekst, Systemtittel} from "nav-frontend-typografi";
import React from "react";
import DokumentBinder from "../ikoner/DocumentBinder";
import "./oppgaver.less";
import {EkspanderbartpanelBase} from "nav-frontend-ekspanderbartpanel";
import OppgaveView from "./OppgaveView";
import {
    Oppgave,
} from "../../redux/innsynsdata/innsynsdataReducer";
import Lastestriper from "../lastestriper/Lasterstriper";
import {FormattedMessage} from "react-intl";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";
import VilkarView from "../vilkar/VilkarView";
import IngenOppgaverPanel from "./IngenOppgaverPanel";
import {formatDato} from "../../utils/formatting";
import {OpplastingAvVedleggModal} from "./OpplastingAvVedleggModal";

interface Props {
    oppgaver: null | Oppgave[];
    leserData?: boolean;
}

function foersteInnsendelsesfrist(oppgaver: null | Oppgave[]): Date | null {
    if (oppgaver === null) {
        return null;
    }
    if (oppgaver.length > 0) {
        const innsendelsesfrister = oppgaver.map((oppgave: Oppgave) => new Date(oppgave.innsendelsesfrist!!));
        return innsendelsesfrister[0];
    }
    return null;
}

export function antallDagerEtterFrist(innsendelsesfrist: null | Date): number {
    if (innsendelsesfrist === null) {
        return 0;
    }
    let now = Math.floor(new Date().getTime() / (3600 * 24 * 1000)); //days as integer from..
    let frist = Math.floor(innsendelsesfrist.getTime() / (3600 * 24 * 1000)); //days as integer from..
    return now - frist;
}

function getAntallDagerTekst(antallDagerSidenFristBlePassert: number): string {
    return antallDagerSidenFristBlePassert > 1
        ? antallDagerSidenFristBlePassert + " dager"
        : antallDagerSidenFristBlePassert + " dag";
}

const Oppgaver: React.FC<Props> = ({oppgaver, leserData}) => {
    const brukerHarOppgaver: boolean = oppgaver !== null && oppgaver.length > 0;
    const oppgaverErFraInnsyn: boolean = brukerHarOppgaver && oppgaver!![0].oppgaveElementer!![0].erFraInnsyn;
    let innsendelsesfrist = oppgaverErFraInnsyn ? foersteInnsendelsesfrist(oppgaver) : null;
    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(innsendelsesfrist);

    return (
        <>
            <Panel className="panel-luft-over">
                {leserData && <Lastestriper linjer={1} />}
                {!leserData && (
                    <Systemtittel>
                        <FormattedMessage id="oppgaver.dine_oppgaver" />
                    </Systemtittel>
                )}
            </Panel>

            <VilkarView />

            {leserData && (
                <Panel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
                    <Lastestriper linjer={1} />
                </Panel>
            )}

            <IngenOppgaverPanel leserData={leserData} />

            {brukerHarOppgaver && (
                <Panel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
                    <EkspanderbartpanelBase
                        apen={true}
                        heading={
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
                                                    antall_dager: getAntallDagerTekst(antallDagerSidenFristBlePassert),
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

                        <DriftsmeldingVedlegg leserData={leserData} />

                        <div>
                            {oppgaver !== null &&
                                oppgaver.map((oppgave: Oppgave, oppgaveIndex: number) => (
                                    <OppgaveView
                                        oppgave={oppgave}
                                        key={oppgaveIndex}
                                        oppgaverErFraInnsyn={oppgaverErFraInnsyn}
                                        oppgaveIndex={oppgaveIndex}
                                    />
                                ))}
                        </div>
                    </EkspanderbartpanelBase>
                </Panel>
            )}
        </>
    );
};

export default Oppgaver;
