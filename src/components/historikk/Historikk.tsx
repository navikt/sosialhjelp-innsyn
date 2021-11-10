import React, {useState} from "react";
import "./historikk.less";
import {Hendelse} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import Lastestriper from "../lastestriper/Lasterstriper";
import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {useIntl} from "react-intl";
import {BodyShort, Button, Label} from "@navikt/ds-react";
import {UnmountClosed} from "react-collapse";
import styled from "styled-components";
import {Collapse, Expand} from "@navikt/ds-icons";

const MAX_ANTALL_KORT_LISTE = 3;

interface Props {
    hendelser: null | Hendelse[];
    restStatus: REST_STATUS;
}

const CenteredButton = styled(Button)`
    width: fit-content;
    align-self: center;
`;

const FlexContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

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
                        <Label>
                            <DatoOgKlokkeslett tidspunkt={hendelse.tidspunkt} />
                        </Label>
                        <BodyShort>{hendelse.beskrivelse}</BodyShort>
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
    const historikkListeClassname = apen ? "historikk_start" : "historikk_start_lukket";

    const toggleOpen = () => {
        setApen(!apen);
    };

    return (
        <FlexContainer>
            {apen ? (
                <UnmountClosed isOpened={apen}>
                    <HistorikkListe hendelser={hendelser} className="historikk" leserData={false} />
                </UnmountClosed>
            ) : (
                <HistorikkListe
                    hendelser={hendelser.slice(0, MAX_ANTALL_KORT_LISTE)}
                    className={"historikk " + historikkListeClassname}
                    leserData={false}
                />
            )}

            <CenteredButton variant="tertiary" onClick={toggleOpen}>
                {apen ? (
                    <>
                        Lukk <Collapse />{" "}
                    </>
                ) : (
                    <>
                        Vis alle ({hendelser.length}) <Expand />
                    </>
                )}
            </CenteredButton>
        </FlexContainer>
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
