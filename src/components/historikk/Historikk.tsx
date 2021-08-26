import React, {useState} from "react";
import {Normaltekst, Element} from "nav-frontend-typografi";
import "./historikk.less";
import {Hendelse} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import Lesmerpanel from "nav-frontend-lesmerpanel";
import Lastestriper from "../lastestriper/Lasterstriper";
import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {useIntl} from "react-intl";

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
    leserData: boolean;
}

const HistorikkListe: React.FC<HistorikkListeProps> = ({hendelser, className, leserData}) => {
    const intl = useIntl();
    if (leserData) {
        return <Lastestriper linjer={3} />;
    }

    const onClickHendelseLenke = (beskrivelse: string, lenketekst?: string) => {
        if (beskrivelse === intl.formatMessage({id: "forelopigSvar"}).trim()) {
            logButtonOrLinkClick(`Historikk: åpnet foreløpig svar`);
        } else if (beskrivelse === intl.formatMessage({id: "oppgaver.maa_sende_dok_veileder"})) {
            logButtonOrLinkClick(`Historikk: åpnet etterspørsel av dokumentasjon`);
        } else if (lenketekst === "Vis søknaden") {
            logButtonOrLinkClick(`Historikk: åpnet søknaden`);
        } else if (beskrivelse.includes("er ferdig behandlet") && lenketekst === "Vis brevet") {
            logButtonOrLinkClick(`Historikk: åpnet vedtak fattet`);
        } else {
            logButtonOrLinkClick(`Historikk: ukjent hendelse`);
        }
    };

    return (
        <ul className={className}>
            {hendelser.map((hendelse: Hendelse, index: number) => {
                return (
                    <li key={index}>
                        <Element>
                            <DatoOgKlokkeslett tidspunkt={hendelse.tidspunkt} />
                        </Element>
                        <Normaltekst>{hendelse.beskrivelse}</Normaltekst>
                        {hendelse.filUrl && (
                            <EksternLenke
                                href={hendelse.filUrl.link}
                                target="_blank"
                                onClick={() => {
                                    onClickHendelseLenke(hendelse.beskrivelse, hendelse?.filUrl?.linkTekst);
                                }}
                            >
                                {hendelse.filUrl.linkTekst}
                            </EksternLenke>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

const KortHistorikk: React.FC<{hendelser: Hendelse[]; leserData: boolean}> = ({hendelser, leserData}) => {
    return <HistorikkListe hendelser={hendelser} className="historikk" leserData={leserData} />;
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
                    leserData={false}
                />
            }
        >
            <HistorikkListe
                hendelser={hendelser.slice(MAX_ANTALL_KORT_LISTE)}
                className="historikk"
                leserData={false}
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
        return <KortHistorikk hendelser={sorterteHendelser} leserData={skalViseLastestripe(restStatus)} />;
    }
    if (sorterteHendelser.length > MAX_ANTALL_KORT_LISTE) {
        return <LangHistorikk hendelser={sorterteHendelser} />;
    }
    return <></>;
};

export default Historikk;
