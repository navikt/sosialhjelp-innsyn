import Panel from "nav-frontend-paneler";
import {Element, Normaltekst, Systemtittel} from "nav-frontend-typografi";
import React from "react";
import DokumentBinder from "../ikoner/DocumentBinder";
import "./oppgaver.less";
import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import OppgaveView from "./OppgaveView";
import {InnsynsdataType, Oppgave} from "../../redux/innsynsdata/innsynsdataReducer";
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
import useSoknadsSakerService from "../../saksoversikt/sakerFraSoknad/useSoknadsSakerService";
import NavFrontendSpinner from "nav-frontend-spinner";

interface Props {
    oppgaver: null | Oppgave[];
    restStatus: REST_STATUS;
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

const Oppgaver: React.FC<Props> = ({oppgaver, restStatus}) => {
    const brukerHarOppgaver: boolean = oppgaver !== null && oppgaver.length > 0;
    const oppgaverErFraInnsyn: boolean = brukerHarOppgaver && oppgaver!![0].oppgaveElementer!![0].erFraInnsyn;
    let innsendelsesfrist = oppgaverErFraInnsyn ? foersteInnsendelsesfrist(oppgaver) : null;
    let antallDagerSidenFristBlePassert = antallDagerEtterFrist(innsendelsesfrist);

    const innsynData: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    const innsynRestStatus = innsynData.restStatus.saker;
    const leserInnsynData: boolean =
        innsynRestStatus === REST_STATUS.INITIALISERT || innsynRestStatus === REST_STATUS.PENDING;

    const soknadApiData = useSoknadsSakerService();
    const leserSoknadApiData: boolean =
        soknadApiData.restStatus === REST_STATUS.INITIALISERT || soknadApiData.restStatus === REST_STATUS.PENDING;

    const leserData: boolean = leserInnsynData || leserSoknadApiData;
    const mustLogin: boolean = innsynRestStatus === REST_STATUS.UNAUTHORIZED;

    console.log("Oppgaver.tsx - leserData", leserData);
    console.log("Oppgaver.tsx - mustlogin", mustLogin);

    return (
        <>
            {mustLogin && (
                <div className="application-spinner">
                    <NavFrontendSpinner type="XL" />
                </div>
            )}

            {!mustLogin && (
                <Panel className="panel-luft-over">
                    <Systemtittel>
                        <FormattedMessage id="oppgaver.dine_oppgaver" />
                    </Systemtittel>
                </Panel>
            )}

            {!mustLogin && <VilkarView />}

            {!mustLogin && skalViseLastestripe(restStatus) && (
                <Panel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
                    <Lastestriper linjer={1} />
                </Panel>
            )}

            {!mustLogin && <IngenOppgaverPanel leserData={skalViseLastestripe(restStatus)} />}

            {!mustLogin && brukerHarOppgaver && (
                <Panel
                    className={
                        "panel-glippe-over oppgaver_panel " +
                        (brukerHarOppgaver ? "oppgaver_panel_bruker_har_oppgaver" : "")
                    }
                >
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

                        <DriftsmeldingVedlegg leserData={skalViseLastestripe(restStatus)} />

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
                    </Ekspanderbartpanel>
                </Panel>
            )}
        </>
    );
};

export default Oppgaver;
