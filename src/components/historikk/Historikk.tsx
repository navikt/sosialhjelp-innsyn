import React, {useState} from "react";
import "./historikk.css";
import EksternLenke from "../eksternLenke/EksternLenke";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import Lastestriper from "../lastestriper/Lasterstriper";
import {logButtonOrLinkClick} from "../../utils/amplitude";
import {useTranslation} from "react-i18next";
import {BodyShort, Button, Label, Link as NavDsLink} from "@navikt/ds-react";
import {UnmountClosed} from "react-collapse";
import styled from "styled-components";
import {Collapse, Expand} from "@navikt/ds-icons";
import {useHentHendelser} from "../../generated/hendelse-controller/hendelse-controller";
import {HendelseResponse} from "../../generated/model";
import {Link} from "react-router-dom";

const MAX_ANTALL_KORT_LISTE = 3;

interface Props {
    fiksDigisosId: string;
}

const CenteredButton = styled(Button)`
    width: fit-content;
    align-self: center;
`;

const FlexContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

function sorterHendelserKronologisk(hendelser: HendelseResponse[]): HendelseResponse[] {
    return hendelser.sort((a: HendelseResponse, b: HendelseResponse) => {
        let c = new Date(a.tidspunkt);
        let d = new Date(b.tidspunkt);
        return c > d ? -1 : c < d ? 1 : 0;
    });
}

interface HistorikkListeProps {
    hendelser: HendelseResponse[];
    className: string;
    leserData: boolean;
}

const HistorikkListe: React.FC<HistorikkListeProps> = ({hendelser, className, leserData}) => {
    const {t} = useTranslation();
    if (leserData) {
        return <Lastestriper linjer={3} />;
    }

    const onClickHendelseLenke = (beskrivelse: string, lenketekst?: string) => {
        if (beskrivelse === t("forelopigSvar").trim()) {
            logButtonOrLinkClick(`Historikk: åpnet foreløpig svar`);
        } else if (beskrivelse === t("oppgaver.maa_sende_dok_veileder")) {
            logButtonOrLinkClick(`Historikk: åpnet etterspørsel av dokumentasjon`);
        } else if (lenketekst === "Vis søknaden") {
            logButtonOrLinkClick(`Historikk: åpnet søknaden`);
        } else if (beskrivelse.includes("er ferdig behandlet") && lenketekst === "Vis brevet") {
            logButtonOrLinkClick(`Historikk: åpnet vedtak fattet`);
        } else {
            logButtonOrLinkClick(`Historikk: ukjent hendelse`);
        }
    };

    const getBeskrivelse = (beskrivelse: string) => {
        if (beskrivelse === "Dine utbetalinger har blitt oppdatert.") {
            const beskrivelseUtenLenke = beskrivelse.replace("Dine utbetalinger", "");
            return (
                <BodyShort>
                    <NavDsLink as={Link} to="/utbetaling">
                        Dine utbetalinger
                    </NavDsLink>
                    {beskrivelseUtenLenke}
                </BodyShort>
            );
        }
        return <BodyShort>{beskrivelse}</BodyShort>;
    };

    return (
        <ul className={className}>
            {hendelser.map((hendelse: HendelseResponse, index: number) => {
                return (
                    <li key={index}>
                        <Label as="p">
                            <DatoOgKlokkeslett tidspunkt={hendelse.tidspunkt} />
                        </Label>
                        {getBeskrivelse(hendelse.beskrivelse)}
                        {hendelse.filUrl && (
                            <EksternLenke
                                href={hendelse.filUrl.link}
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

const KortHistorikk: React.FC<{hendelser: HendelseResponse[]; leserData: boolean}> = ({hendelser, leserData}) => {
    return <HistorikkListe hendelser={hendelser} className="historikk" leserData={leserData} />;
};

const LangHistorikk: React.FC<{hendelser: HendelseResponse[]}> = ({hendelser}) => {
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

            <CenteredButton
                variant="tertiary"
                onClick={toggleOpen}
                iconPosition={"right"}
                icon={apen ? <Collapse /> : <Expand />}
            >
                {apen ? "Lukk" : `Vis alle (${hendelser.length})`}
            </CenteredButton>
        </FlexContainer>
    );
};

const Historikk: React.FC<Props> = ({fiksDigisosId}) => {
    const {data: hendelser, isLoading} = useHentHendelser(fiksDigisosId);
    if (!hendelser) {
        return null;
    }
    const sorterteHendelser = sorterHendelserKronologisk(hendelser);
    if (sorterteHendelser.length < MAX_ANTALL_KORT_LISTE + 1) {
        return <KortHistorikk hendelser={sorterteHendelser} leserData={isLoading} />;
    }
    if (sorterteHendelser.length > MAX_ANTALL_KORT_LISTE) {
        return <LangHistorikk hendelser={sorterteHendelser} />;
    }
    return null;
};

export default Historikk;
