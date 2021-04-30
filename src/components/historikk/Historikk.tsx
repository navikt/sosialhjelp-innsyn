import React, {useState} from "react";
import {Element, Normaltekst} from "nav-frontend-typografi";
import "./historikk.less";
import {Hendelse} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import Lesmerpanel from "nav-frontend-lesmerpanel";
import Lastestriper from "../lastestriper/Lasterstriper";
import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import Alertstripe from "nav-frontend-alertstriper";

const MAX_ANTALL_KORT_LISTE = 3;

interface Props {
    hendelser: null | Hendelse[];
    restStatus: REST_STATUS;
}

function sorterHendelserKronologisk(hendelser: Hendelse[]): Hendelse[] {
    return hendelser.sort((a: Hendelse, b: Hendelse) => {
        let c = new Date(a.tidspunkt);
        let d = new Date(b.tidspunkt);
        return c > d ? -1 : c < d ? 1 : 0;
    });
}

interface HistorikkListeProps {
    hendelser: Hendelse[];
    className: string;
    restStatus: REST_STATUS;
}

const HistorikkListe: React.FC<HistorikkListeProps> = ({hendelser, className, restStatus}) => {
    return (
        <ul className={className}>
            {skalViseLastestripe(restStatus, true) && <Lastestriper linjer={3} />}

            {restStatus === REST_STATUS.FEILET && (
                <Alertstripe type="feil" form="inline">
                    Vi klarte ikke hente dine oppgaver
                </Alertstripe>
            )}
            {hendelser.map((hendelse: Hendelse, index: number) => {
                return (
                    <li key={index}>
                        <Element>
                            <DatoOgKlokkeslett tidspunkt={hendelse.tidspunkt} />
                        </Element>
                        <Normaltekst>{hendelse.beskrivelse}</Normaltekst>
                        {hendelse.filUrl && (
                            <EksternLenke href={hendelse.filUrl.link} target="_blank">
                                {hendelse.filUrl.linkTekst}
                            </EksternLenke>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

const KortHistorikk: React.FC<{hendelser: Hendelse[]; restStatus: REST_STATUS}> = ({hendelser, restStatus}) => {
    return <HistorikkListe hendelser={hendelser} className="historikk" restStatus={restStatus} />;
};

const LangHistorikk: React.FC<{hendelser: Hendelse[]}> = ({hendelser}) => {
    const [apen, setApen] = useState(false);
    const antallSkjulteElementer = hendelser.slice(MAX_ANTALL_KORT_LISTE).length;
    const historikkListeClassname = apen ? "historikk_start" : "historikk_start_lukket";
    return (
        <Lesmerpanel
            className="lesMerPanel__historikk"
            apneTekst={"Vis alle (" + antallSkjulteElementer + ") "}
            defaultApen={apen}
            onClose={() => setApen(false)}
            onOpen={() => setApen(true)}
            intro={
                <HistorikkListe
                    hendelser={hendelser.slice(0, MAX_ANTALL_KORT_LISTE)}
                    className={"historikk " + historikkListeClassname}
                    restStatus={REST_STATUS.OK}
                />
            }
        >
            <HistorikkListe
                hendelser={hendelser.slice(MAX_ANTALL_KORT_LISTE)}
                className="historikk"
                restStatus={REST_STATUS.OK}
            />
        </Lesmerpanel>
    );
};

const Historikk: React.FC<Props> = ({hendelser, restStatus}) => {
    if (hendelser === null) {
        return null;
    }
    const sorterteHendelser = sorterHendelserKronologisk(hendelser);
    if (sorterteHendelser.length < MAX_ANTALL_KORT_LISTE + 1) {
        return <KortHistorikk hendelser={sorterteHendelser} restStatus={restStatus} />;
    }
    if (sorterteHendelser.length > MAX_ANTALL_KORT_LISTE) {
        return <LangHistorikk hendelser={sorterteHendelser} />;
    }
    return <></>;
};

export default Historikk;
