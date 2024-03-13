import React, {useState} from "react";
import EksternLenke from "../eksternLenke/EksternLenke";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import Lastestriper from "../lastestriper/Lasterstriper";
import {logButtonOrLinkClick, logSoknadBehandlingsTid} from "../../utils/amplitude";
import {Trans, useTranslation} from "react-i18next";
import {BodyShort, Button, Label, Link as NavDsLink} from "@navikt/ds-react";
import {UnmountClosed} from "react-collapse";
import styled from "styled-components";
import {Collapse, Expand} from "@navikt/ds-icons";
import {useHentHendelser} from "../../generated/hendelse-controller/hendelse-controller";
import {HendelseResponse} from "../../generated/model";
import {HistorikkTekstEnum} from "./HistorikkTekstEnum";
import Link from "next/link";

const MAX_ANTALL_KORT_LISTE = 3;

interface Props {
    fiksDigisosId: string;
}

const CenteredButton = styled(Button)`
    margin: 20px 0 0 -5.5px;
    width: fit-content;
    align-self: left;
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
        if (beskrivelse === "BREV_OM_SAKSBEANDLINGSTID") {
            logButtonOrLinkClick(`Historikk: åpnet foreløpig svar`);
        } else if (beskrivelse === "ETTERSPOR_MER_DOKUMENTASJON") {
            logButtonOrLinkClick(`Historikk: åpnet etterspørsel av dokumentasjon`);
        } else if (lenketekst === "SOKNAD_SEND_TIL_KONTOR_LENKETEKST") {
            logButtonOrLinkClick(`Historikk: åpnet søknaden`);
        } else if (
            (beskrivelse === "SOKNAD_FERDIGBEHADNLET" ||
                beskrivelse === "SAK_FERDIGBEHANDLET_MED_TITTEL" ||
                beskrivelse === "SAK_FERDIGBEHANDLET_UTEN_TITTEL") &&
            lenketekst === "VIS_BREVET_LENKETEKST"
        ) {
            logButtonOrLinkClick(`Historikk: åpnet vedtak fattet`);
        } else {
            logButtonOrLinkClick(`Historikk: ukjent hendelse`);
        }
    };

    const getBeskrivelse = (historikkEnumKey: keyof typeof HistorikkTekstEnum, tekstArgument?: string) => {
        const enumValue = HistorikkTekstEnum[historikkEnumKey];
        if (enumValue === HistorikkTekstEnum.UTBETALINGER_OPPDATERT) {
            return (
                <BodyShort weight="semibold">
                    <Trans t={t} i18nKey={enumValue}>
                        {/*Lenken finnes som <0></0> i språkfila. 0 = første children.
                        Teksten her er bare default value, og vil bli oversatt ved språkbytte*/}
                        <Link href="/utbetaling">
                            <NavDsLink>Dine utbetalinger</NavDsLink>
                        </Link>{" "}
                        har blitt oppdatert
                    </Trans>
                </BodyShort>
            );
        }
        if (
            (enumValue === HistorikkTekstEnum.SAK_UNDER_BEHANDLING_MED_TITTEL ||
                enumValue === HistorikkTekstEnum.SAK_FERDIGBEHANDLET_MED_TITTEL) &&
            tekstArgument
        ) {
            // Dette er bare placeholder. Blir erstatta av faktisk oversatt tekst runtime. <span> må være child nummer 1 (index 0), for at det skal bli riktig
            return (
                <BodyShort weight="semibold">
                    <Trans i18nKey={enumValue} t={t}>
                        <span lang="no">{{tekstArgument}}</span> er under behandling.
                    </Trans>
                </BodyShort>
            );
        } else if (
            [
                HistorikkTekstEnum.SOKNAD_SEND_TIL_KONTOR,
                HistorikkTekstEnum.SOKNAD_MOTTATT_MED_KOMMUNENAVN,
                HistorikkTekstEnum.SOKNAD_VIDERESENDT_MED_NORG_ENHET,
                HistorikkTekstEnum.SOKNAD_VIDERESENDT_PAPIRSOKNAD_MED_NORG_ENHET,
                HistorikkTekstEnum.SOKNAD_KAN_IKKE_VISE_STATUS_MED_TITTEL,
                HistorikkTekstEnum.SAK_KAN_IKKE_VISE_STATUS_MED_TITTEL,
            ].includes(enumValue)
        ) {
            // Dette er bare placeholder. Blir erstatta av faktisk oversatt tekst runtime. <span> må være child nummer 2 (index 1), for at det skal bli riktig
            return (
                <BodyShort weight="semibold">
                    <Trans i18nKey={enumValue} t={t}>
                        <span lang="no">{{tekstArgument}}</span>
                    </Trans>
                </BodyShort>
            );
        }
        return <BodyShort weight="semibold">{t(enumValue, {tekstArgument: tekstArgument})}</BodyShort>;
    };

    return (
        <ul className={className}>
            {hendelser.map((hendelse: HendelseResponse, index: number) => {
                return (
                    <li key={index}>
                        <Label as="div">
                            {getBeskrivelse(
                                hendelse.hendelseType as keyof typeof HistorikkTekstEnum,
                                hendelse.tekstArgument
                            )}
                            {hendelse.filUrl && (
                                <EksternLenke
                                    href={hendelse.filUrl.link}
                                    onClick={() => {
                                        onClickHendelseLenke(hendelse.hendelseType, hendelse?.filUrl?.linkTekst);
                                    }}
                                >
                                    {t(HistorikkTekstEnum[hendelse.filUrl.linkTekst])}
                                </EksternLenke>
                            )}
                        </Label>
                        <DatoOgKlokkeslett tidspunkt={hendelse.tidspunkt} />
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
    const {t} = useTranslation();
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
                size={"xsmall"}
                iconPosition={"left"}
                icon={apen ? <Collapse aria-hidden title="Lukk" /> : <Expand aria-hidden title="Vis alle" />}
            >
                {apen ? t("historikk.lukk") : `${t("historikk.se_hele_prosessen")}`}
            </CenteredButton>
        </FlexContainer>
    );
};

const StyledTextPlacement = styled.div`
    margin-bottom: 1rem;
    @media screen and (max-width: 640px) {
        margin-left: 2rem;
    }
`;

const Historikk: React.FC<Props> = ({fiksDigisosId}) => {
    const {data: hendelser, isLoading, isError} = useHentHendelser(fiksDigisosId);
    const {t} = useTranslation();
    logSoknadBehandlingsTid(hendelser);

    console.log("hendelser", hendelser);

    const soknadSendTilKontor = hendelser?.find((item) => item.hendelseType === "SOKNAD_SEND_TIL_KONTOR");
    const soknadFerdigbehandlet = hendelser?.find((item) => item.hendelseType === "SOKNAD_FERDIGBEHANDLET");

    const sakUnderBehandlingMedTittel = hendelser?.find(
        (item) => item.hendelseType === "SAK_UNDER_BEHANDLING_MED_TITTEL"
    );
    const sakFerdigbehandletMedTittel = hendelser?.find(
        (item) => item.hendelseType === "SAK_FERDIGBEHANDLET_MED_TITTEL"
    );
    const sakUnderBehandlingUtenTittel = hendelser?.find(
        (item) => item.hendelseType === "SAK_UNDER_BEHANDLING_UTEN_TITTEL"
    );
    const sakFerdigbehandletUtenTittel = hendelser?.find(
        (item) => item.hendelseType === "SAK_FERDIGBEHANDLET_UTEN_TITTEL"
    );

    if (sakUnderBehandlingMedTittel && sakFerdigbehandletMedTittel) {
        const msDay = 24 * 60 * 60 * 1000;

        const sakUnderBehandlingMedTittelTid: Date = new Date(sakUnderBehandlingMedTittel?.tidspunkt ?? "");
        const sakFerdigbehandletMedMedTittelTid: Date = new Date(sakFerdigbehandletMedTittel?.tidspunkt ?? "");
        console.log(
            "(tittelFerdig-tittelSendt)/msday",
            Math.ceil(
                (sakFerdigbehandletMedMedTittelTid?.getTime() - sakUnderBehandlingMedTittelTid?.getTime()) / msDay
            )
        );

        /**TODO: Trenger ikke å ha kommunenummer med tanke på at dette er en sak*/
        //logAmplitudeEvent("Klikk på knapp eller lenke", {
        //    msDay,
        //});
    }

    if (sakUnderBehandlingUtenTittel && sakFerdigbehandletUtenTittel) {
        const msDay = 24 * 60 * 60 * 1000;

        const sakUnderBehandlingUtenTittelTid: Date = new Date(sakUnderBehandlingUtenTittel?.tidspunkt ?? "");
        const sakFerdigbehandletUtenTittelTid: Date = new Date(sakFerdigbehandletUtenTittel?.tidspunkt ?? "");
        console.log(
            "(utenFerdig-utenSendt)/msday",
            Math.ceil((sakFerdigbehandletUtenTittelTid?.getTime() - sakUnderBehandlingUtenTittelTid?.getTime()) / msDay)
        );
    }

    if (sakUnderBehandlingUtenTittel && sakFerdigbehandletMedTittel) {
        const msDay = 24 * 60 * 60 * 1000;

        const sakUnderBehandlingUtenTittelTid: Date = new Date(sakUnderBehandlingUtenTittel?.tidspunkt ?? "");
        const sakFerdigbehandletMedTittelTid: Date = new Date(sakFerdigbehandletMedTittel?.tidspunkt ?? "");
        console.log(
            "(utenFerdig-utenSendt)/msday",
            Math.ceil((sakFerdigbehandletMedTittelTid?.getTime() - sakUnderBehandlingUtenTittelTid?.getTime()) / msDay)
        );
    }

    /**
     *                      (søknadsbehandlingstiden)
     * Det er ønskelig å måle saksbehandlingstid fra søknad er sendt inn, til den har fått status ferdigbehandlet.
     *
     * Vi bør også måle på når saker er ferdigbehandlet.
     *
     * Det er ønskelig at vi stanser telling av dager når vi mottar hendelse dokumentasjon_etterspurt,
     * og starter telling når bruker ikke har oppgaver lenger.
     *
     * Dette er fordi at saksbehandlingstiden stopper å gå når veileder etterspør mer dokumentasjon.
     *
     * alt under 24 timer = 1 dag
     * alt over er x dag
     * vi må også ha kommunenummer med
     * */

    //logAmplitudeEvent("Lastet utbetalinger", {
    //    antall: nye?.[0]?.utbetalingerForManed.length ? nye?.[0].utbetalingerForManed.length : 0,
    //});
    //
    //logAmplitudeEvent("vedtak per sak", {
    //    sak: index + 1,
    //    antallVedtak: statusdetalj.vedtaksfilUrlList ? statusdetalj.vedtaksfilUrlList.length : 0,
    //});

    //logAmplitudeEvent("saksbehandlingstiden er: ",{
    //    tid: hendelser?.filter((user) => {
    //        user.hendelseType !== "SOKNAD_SEND_TIL_KONTOR";
    //    })
    //});

    //const errors: Error[] = filerData
    //    .filter((it) => it.status !== "OK")
    //    .map((it) => ({feil: determineErrorType(it.status)!, filnavn: it.filnavn}));

    if (isError) {
        return <StyledTextPlacement>{t("feilmelding.historikk_innlasting")}</StyledTextPlacement>;
    }
    if (isLoading && !hendelser) {
        return <Lastestriper />;
    }
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
