import React, {useState} from "react";
import EksternLenke from "../eksternLenke/EksternLenke";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import Lastestriper from "../lastestriper/Lasterstriper";
import {logButtonOrLinkClick} from "../../utils/amplitude";
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
                        <Label as="p">
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

const beregnBehandlingstid = (firstElementDate: number, lastElementDate: number, tekst: string) => {
    const sakMiliseconds = Math.abs(firstElementDate - lastElementDate);

    const msDay = 24 * 60 * 60 * 1000;
    const msHours = 60 * 60 * 1000;
    const msMinutes = 60 * 1000;

    const sakDays = Math.floor(sakMiliseconds / msDay);
    const sakHours = Math.floor((sakMiliseconds - sakDays * msDay) / msHours);
    const sakMinutes = Math.floor((sakMiliseconds - sakHours * msHours - sakDays * msDay) / msMinutes);

    return (
        "Det tok " +
        sakDays +
        " dag(er) " +
        sakHours +
        " time(r) og " +
        sakMinutes +
        " minutt(er) " +
        "før " +
        tekst +
        " fikk status ferdigbehandlet"
    );
};

const Historikk: React.FC<Props> = ({fiksDigisosId}) => {
    const {data: hendelser, isLoading, isError} = useHentHendelser(fiksDigisosId);
    const {t} = useTranslation();

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
     * */

    /** CODE THAT IS WORKED ON */
    //console.log("hendelser", hendelser);
    //console.log("-------");

    const filterHendelserSoknadBehandlet =
        hendelser &&
        hendelser?.filter((type) => {
            return type.hendelseType === "SOKNAD_FERDIGBEHANDLET";
        });

    const filterBasedOnSoknadHendelser =
        hendelser &&
        hendelser?.filter((type) => {
            return type.hendelseType === "SOKNAD_SEND_TIL_KONTOR" || type.hendelseType === "SOKNAD_FERDIGBEHANDLET";
        });

    if (filterHendelserSoknadBehandlet && filterHendelserSoknadBehandlet?.length > 0) {
        const soknadFerdigbehandlet = filterBasedOnSoknadHendelser
            ? Date.parse(filterBasedOnSoknadHendelser[0].tidspunkt).valueOf()
            : 0;
        const soknadSendtTilKontor = filterBasedOnSoknadHendelser
            ? Date.parse(filterBasedOnSoknadHendelser[filterBasedOnSoknadHendelser.length - 1].tidspunkt).valueOf()
            : 0;

        console.log(beregnBehandlingstid(soknadFerdigbehandlet, soknadSendtTilKontor, "søknaden"));
        //amplitude(beregnSoknadsBehandlingstid(soknadFerdigbehandlet, soknadSendtTilKontor));
    }

    const filterHendelserSakBehandlet =
        hendelser &&
        hendelser?.filter((type) => {
            return type.hendelseType === "SAK_FERDIGBEHANDLET_MED_TITTEL";
        });

    const filterBasedOnSakHendelser = hendelser?.filter((type) => {
        return (
            type.hendelseType === "SAK_UNDER_BEHANDLING_MED_TITTEL" ||
            type.hendelseType === "SAK_FERDIGBEHANDLET_MED_TITTEL"
        );
    });

    let groupSaksBasedOnTekstArgument;
    if (filterHendelserSakBehandlet && Object.keys(filterHendelserSakBehandlet).length > 0) {
        groupSaksBasedOnTekstArgument = filterBasedOnSakHendelser?.reduce(
            (group: {[key: string]: HendelseResponse[]}, item, num) => {
                if (!group[item.tekstArgument]) {
                    group[item.tekstArgument] = [];
                }
                group[item.tekstArgument].push(item);
                return group;
            },
            {}
        );

        //}
        //console.log("group", groupSaksBasedOnTekstArgument);
        //Object { "test 7": (2) […], "test 8": (3) […] }
        //"test 7": Array [ {…}, {…} ]
        //0: Object { tidspunkt: "2024-03-05T13:23:58.916", hendelseType: "SAK_FERDIGBEHANDLET_MED_TITTEL", tekstArgument: "test 7", … }
        //1: Object { tidspunkt: "2024-03-05T13:20:12.426", hendelseType: "SAK_UNDER_BEHANDLING_MED_TITTEL", tekstArgument: "test 7", … } length: 2
        //"test 8": Array(3) [ {…}, {…}, {…} ]
        //0: Object { tidspunkt: "2024-03-05T13:22:57.854", hendelseType: "SAK_FERDIGBEHANDLET_MED_TITTEL", tekstArgument: "test 8", … }
        //1: Object { tidspunkt: "2024-03-05T13:20:23.230", hendelseType: "SAK_FERDIGBEHANDLET_MED_TITTEL", tekstArgument: "test 8", … }
        //2: Object { tidspunkt: "2024-03-05T13:20:17.046", hendelseType: "SAK_UNDER_BEHANDLING_MED_TITTEL", tekstArgument: "test 8", … } length: 3

        if (groupSaksBasedOnTekstArgument && Object.keys(groupSaksBasedOnTekstArgument).length > 0) {
            const firstElement = filterBasedOnSakHendelser
                ? Date.parse(filterBasedOnSoknadHendelser[0].tidspunkt).valueOf()
                : 0;
            const lastElement = filterBasedOnSakHendelser
                ? Date.parse(filterBasedOnSoknadHendelser[filterBasedOnSoknadHendelser.length - 1].tidspunkt).valueOf()
                : 0;

            console.log(beregnBehandlingstid(firstElement, lastElement, "saken"));

            for (let i = 0; i < Object.keys(groupSaksBasedOnTekstArgument).length; i++) {
                console.log("wat ", i);
                console.log("wattttttt ", groupSaksBasedOnTekstArgument[i].tekstArgument);
            }

            Object.keys(groupSaksBasedOnTekstArgument).forEach((element) => {
                console.log("element", element);
            });

            /*
        for (const key in groupSaksBasedOnTekstArgument) {

            //console.log("-----------!!-----------")
            //console.log("groupSaksBasedOnTekstArgument[key][0]: " + (groupSaksBasedOnTekstArgument[key][0]?.tidspunkt).valueOf());
            //console.log("filterBasedOnsakHendelser[groupSaksBasedOnTekstArgument[key].length - 1]: " + (groupSaksBasedOnTekstArgument[key][groupSaksBasedOnTekstArgument]?.tidspunkt).valueOf());

            //const firstElement = groupSaksBasedOnTekstArgument[key]
            //    ? Date.parse(groupSaksBasedOnTekstArgument[key][0]?.tidspunkt).valueOf()
            //    : 0;
            //const lastElement = groupSaksBasedOnTekstArgument[key]
            //    ? Date.parse(filterBasedOnsakHendelser[groupSaksBasedOnTekstArgument[key].length - 1]?.tidspunkt).valueOf()
            //    : 0;

            //const firstElement = groupSaksBasedOnTekstArgument[key]
            //    ? Date.parse(groupSaksBasedOnTekstArgument[0]?.tidspunkt).valueOf()
            //    : 0;
            //const lastElement = groupSaksBasedOnTekstArgument[key]
            //    ? Date.parse(filterBasedOnsakHendelser[groupSaksBasedOnTekstArgument[key].length - 1]?.tidspunkt).valueOf()
            //    : 0;

            const firstElement = filterBasedOnSoknadHendelser
                ? Date.parse(filterBasedOnSoknadHendelser[0].tidspunkt).valueOf()
                : 0;
            const lastElement = filterBasedOnSoknadHendelser
                ? Date.parse(filterBasedOnSoknadHendelser[filterBasedOnSoknadHendelser.length - 1].tidspunkt).valueOf()
                : 0;


            console.log(beregnBehandlingstid(firstElement, lastElement, "saken"));
        }*/
        }
    }
    //console.log("object ", groupSaksBasedOnTekstArgument);
    //console.log("-------");

    //if (filterHendelserSakBehandlet && Object.keys(filterHendelserSakBehandlet).length > 0) {
    //    groupSaksBasedOnTekstArgument = filterBasedOnsakHendelser?.reduce(
    //        (group: HendelseResponse[][], item, num) => {
    //            if (!group[item.tekstArgument]) {
    //                group[item.tekstArgument] = [];
    //            }
    //            group[item.tekstArgument].push(item);
    //            return group;
    //        },
    //        []
    //    );
    //}
    //console.log("array ", groupSaksBasedOnTekstArgument);
    //console.log("-------");

    //console.log("sakMiliseconds", sakMiliseconds);
    //console.log("-------");

    /**
    let sakMiliseconds;
    if (groupObjectsBasedOnSakHendelser) {
        sakMiliseconds = Math.abs(
            Date.parse(groupObjectsBasedOnSakHendelser[0]?.tidspunkt).valueOf() -
            Date.parse(groupObjectsBasedOnSakHendelser[groupObjectsBasedOnSakHendelser.length - 1]?.tidspunkt).valueOf()
        );
    }
    //d * m * s * ms
    //24 * 60 * 60 * 1000
    console.log("sakMiliseconds", sakMiliseconds);
    console.log("-------");

    const sakSeconds = Math.floor(sakMiliseconds / 1000);
    console.log("sakseconds", sakSeconds);
    console.log("-------");

    const sakMinutes = Math.floor(sakSeconds / 60);
    if (sakMinutes >= 1) {
        console.log("sakminutes", sakMinutes);
        console.log("-------");
    }

    const sakHours = Math.floor(sakMinutes / 60);
    if (sakHours >= 1) {
        console.log("sakhours", sokHours);
        console.log("-------");
    }

    const sakDays = Math.floor(sakHours / 24);
    if (sakDays >= 1) {
        console.log("sakdays", sakDays);
        console.log("-------");
    }

    if (groupObjectsBasedOnSakHendelser) {
        console.log(
            "Det tok saken",
            sakDays,
            "dag(er)",
            sakHours - sakDays * 24,
            "time(r)",
            sakMinutes - sakDays * 24 * 60,
            "minutt(er) og",
            sakSeconds - sakDays * 24 * 60 * 60,
            "sekund(er)",
            "før saken fikk status ferdigbehandlet"
        );
    }*/
    /** CODE THAT IS WORKED ON */

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
