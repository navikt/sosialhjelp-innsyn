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

const test = (firstElementDate: number, lastElementDate: number) => {
    const sokMiliseconds = Math.abs(firstElementDate - lastElementDate);

    console.log("sokMiliseconds", sokMiliseconds);
    console.log("-------");

    const msDay = 24 * 60 * 60 * 1000;
    const msHours = 60 * 60 * 1000;
    const msMinutes = 60 * 1000;

    const sokDays = Math.floor(sokMiliseconds / msDay);
    if (sokDays >= 1) {
        console.log("sokdays", sokDays);
        console.log("-------");
    }

    //25 timer
    //1 dag og 1 time
    //140 min
    //2 timer og 20 min

    const sokHours = Math.floor((sokMiliseconds - sokDays * msDay) / msHours);
    if (sokHours >= 1) {
        console.log("sokhours", sokHours);
        console.log("-------");
    }

    //sokMiliseconds=sokMiliseconds-(sokHours*msHours);

    const sokMinutes = Math.floor((sokMiliseconds - sokHours * msHours - sokDays * msDay) / msMinutes);
    if (sokMinutes >= 1) {
        console.log("sokMinutes", sokMinutes);
        console.log("-------");
    }

    return null;
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
    console.log("hendelser", hendelser);
    console.log("-------");

    const filterHendelserSoknadBehandlet = hendelser?.filter((type) => {
        return type.hendelseType === "SOKNAD_FERDIGBEHANDLET";
    });

    const filterBasedOnSoknadHendelser = hendelser?.filter((type) => {
        return type.hendelseType === "SOKNAD_SEND_TIL_KONTOR" || type.hendelseType === "SOKNAD_FERDIGBEHANDLET";
    });
    console.log("filterBasedOnSoknadHendelser", filterBasedOnSoknadHendelser);
    console.log("-------");

    if (filterHendelserSoknadBehandlet?.length > 0) {
        //const soknadHendelser = filterBasedOnSoknadHendelser;
        const soknadFerdigbehandlet = Date.parse(filterBasedOnSoknadHendelser[0]?.tidspunkt).valueOf();
        const soknadSendtTilKontor = Date.parse(
            filterBasedOnSoknadHendelser[filterBasedOnSoknadHendelser?.length - 1]?.tidspunkt
        ).valueOf();

        test(soknadFerdigbehandlet, soknadSendtTilKontor);
    }

    //const sokMinutes = Math.floor(sokMiliseconds / 60);
    //if (sokMinutes >= 1) {
    //    console.log("sokminutes", sokMinutes);
    //    console.log("-------");
    //}
    //
    //if (filterBasedOnSoknadHendelser) {
    //    console.log(
    //        "Det tok søknaden",
    //        sokDays,
    //        "dag(er)",
    //        //sokHours - sokDays * 24,
    //        "time(r)",
    //        //sokMinutes - sokDays * 24 * 60,
    //        "minutt(er) og",
    //        "før søknaden fikk status ferdigbehandlet"
    //    );
    //}

    /**
    const groupObjectsBasedOnSakHendelser = hendelser?.filter((type) => {
        return (
            type.hendelseType === "SAK_UNDER_BEHANDLING_MED_TITTEL" ||
            type.hendelseType === "SAK_FERDIGBEHANDLET_MED_TITTEL"
        );
    });
    console.log("sakHendelser", groupObjectsBasedOnSakHendelser);
    console.log("-------");


    const groupSaksBasedOnTekstArgument = groupObjectsBasedOnSakHendelser?.reduce(
        (group: {[key: string]: HendelseResponse[]}, item, hei) => {
            if (!group[item.tekstArgument]) {
                group[item.tekstArgument] = [];
            }
            group[item.tekstArgument].push(item);
            return group;
        },
        {}
    );
    console.log("groupSaksBasedOnTekstArgument", groupSaksBasedOnTekstArgument);
    console.log("-------");


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

    /*const soknadHendelser = hendelser?.filter((type) => {
       return type.hendelseType === "SOKNAD_SEND_TIL_KONTOR" || type.hendelseType === "SOKNAD_FERDIGBEHANDLET";
    });*/
    //.map((it) => {
    //    return;
    //});
    //console.log("soknadHendelser", soknadHendelser);
    //console.log("-------");
    //const tester = test?.map((user) => {
    //    const event = new Date(Date.parse(user.tidspunkt)).valueOf();
    //    return event;
    //})
    //console.log("tester", tester);

    //const testeras = () => { return Math.abs(Date.parse(test[0]?.tidspunkt).valueOf() - Date.parse(test[test.length - 1]?.tidspunkt).valueOf())};
    //const testeras = Math.abs(Date.parse(test[0]?.tidspunkt).valueOf() - Date.parse(test[test.length - 1]?.tidspunkt).valueOf());
    //const testeras = test?.map((user) => {
    //    const event = Math.abs(Date.parse(user[0]?.tidspunkt).valueOf() - Date.parse(user[user.length - 1]?.tidspunkt).valueOf());
    //    return event;
    //})

    //let miliseconds;
    //if (soknadHendelser) {
    //    miliseconds = Math.abs(
    //        Date.parse(soknadHendelser[0]?.tidspunkt).valueOf() -
    //            Date.parse(soknadHendelser[soknadHendelser.length - 1]?.tidspunkt).valueOf()
    //    );
    //}
    //d * m * s * ms
    //24 * 60 * 60 * 1000

    //console.log("miliseconds", miliseconds);
    // console.log("-------");

    //const seconds = Math.floor(miliseconds / 1000);
    //console.log("seconds", seconds);
    //console.log("-------");

    //const minutes = Math.floor(seconds / 60);
    //if (minutes >= 1) {
    //    console.log("minutes", minutes);
    //    console.log("-------");
    //}

    //const hours = Math.floor(minutes / 60);
    //if (hours >= 1) {
    //    console.log("hours", hours);
    //    console.log("-------");
    //}

    //const days = Math.floor(hours / 24);
    //if (days >= 1) {
    //    console.log("days", days);
    //    console.log("-------");
    //}

    //if (soknadHendelser) {
    //    console.log(
    //        "Det tok søknaden",
    //        days,
    //        "dag(er)",
    //        hours - days * 24,
    //        "time(r)",
    //        minutes - days * 24 * 60,
    //        "minutt(er) og",
    //        seconds - days * 24 * 60 * 60,
    //        "sekund(er)",
    //        "før søknaden fikk status ferdigbehandlet"
    //    );
    //}

    /**----------------------------**/

    /*
    const sakHendelser = hendelser?.filter((type) => {
        return (
            type.hendelseType === "SAK_UNDER_BEHANDLING_MED_TITTEL" ||
            type.hendelseType === "SAK_FERDIGBEHANDLET_MED_TITTEL"
        );
    });
    console.log("sakHendelser", sakHendelser);*/

    //const groupObjectsBasedOnTekstArgument = sakHendelser?.reduce(
    //    (group: {[key: string]: HendelseResponse[]}, item, hei) => {
    //        if (!group[item.tekstArgument]) {
    //            group[item.tekstArgument] = [];
    //        }
    //        group[item.tekstArgument].push(item);
    //        return group;
    //    },
    //    {}
    //);

    ////metadatas.reduce((acc, curr, currentIndex) => ({...acc, [currentIndex]: []}), {});
    ////console.log("groupObjectsBasedOnTekstArgument", groupObjectsBasedOnTekstArgument);

    ////const filterAway = groupObjectsBasedOnTekstArgument.filter((hei) => {
    ////    return (hei.hendelseType === "SAK_UNDER_BEHANDLING_MED_TITTEL" && hei.hendelseType === "SAK_FERDIGBEHANDLET_MED_TITTEL");
    ////})

    //    const result = sakHendelser?.reduce(function (r, a) {
    //        r[a.tekstArgument] = r[a.tekstArgument] || [];
    //        r[a.tekstArgument].push(a);
    //        return r;
    //    }, Object.create(null));
    //
    //console.log(result);
    //console.log("hei", Object.entries(result));

    //const heI = result.map((hallo) => {return hallo.tekstArgument});
    //console.log("heiheiheih", heI)

    //let mili;
    //if (result) {
    //    mili = Math.abs(
    //        Date.parse(result[0]?.tidspunkt).valueOf() -
    //        Date.parse(result[result.length - 1]?.tidspunkt).valueOf()
    //    );
    //}

    //if (hendelser) {
    //console.log("hendelser", hendelser);

    //const testHend = hendelser.filter(
    //    (it) =>
    //        it.hendelseType === "SAK_UNDER_BEHANDLING_MED_TITTEL" ||
    //        it.hendelseType === "SAK_FERDIGBEHANDLET_MED_TITTEL"
    //);
    //console.log("testHend", testHend);

    //const result: HendelseResponse[] = Object.values(
    //    testHend.reduce(function (returnValue, originalValue) {
    //        returnValue[originalValue.tekstArgument] = returnValue[originalValue.tekstArgument] || [];
    //        returnValue[originalValue.tekstArgument].push(originalValue);
    //        return returnValue;
    //    }, {})
    //);
    //console.log("result", result);

    //const wat = result[0].
    //}
    /*
    if (hendelser) {
        //console.log("hendelser", hendelser);

        const testHend: HendelseResponse[] = Object.values(
            hendelser
                .filter(
                    (it) =>
                        it.hendelseType === "SAK_UNDER_BEHANDLING_MED_TITTEL" ||
                        it.hendelseType === "SAK_FERDIGBEHANDLET_MED_TITTEL"
                )
                .reduce((returnValue, originalValue) => {
                    returnValue[originalValue.tekstArgument] = returnValue[originalValue.tekstArgument] || [];
                    returnValue[originalValue.tekstArgument].push(originalValue);
                    return returnValue;
                }, {})
        );
        console.log("testHend", testHend);

        //const wat = testHend.forEach((el1, i1) => {
        //    testHend.forEach((el2, i2) => {
        //        console.log("el1", el1[i1]);
        //        console.log("el2", el2[i2]);
        //
        //        ///if(i1 === i2){
        //        ///    console.log("wwwwaaaaaaa");
        //        ///    return null;
        //        ///}
        //        ///if(el1 && el1.tekstArgument === el2.tekstArgument){
        //        ///    console.log("waaaaaya")
        //        ///    if(el1[0].hendelseType === "SAK_UNDER_BEHANDLING_MED_TITTEL" && el2.hendelseType ==="SAK_FERDIGBEHANDLET_MED_TITTEL"){
        //        ///        return Math.abs(Date.parse(el1[0]?.tidspunkt).valueOf() - Date.parse(el1[el1.length - 1]?.tidspunkt).valueOf());
        //        ///    }
        //        ///}
        //    });
        //});
        //console.log("wat", wat);
        console.log("-------");
    }

     let mili;
     if (sakHendelser) {
         mili = Math.abs(
             Date.parse(sakHendelser[0]?.tidspunkt).valueOf() -
                 Date.parse(sakHendelser[sakHendelser.length - 1]?.tidspunkt).valueOf()
         );
     }
    //d * m * s * ms
    //24 * 60 * 60 * 1000
    */
    /*
     console.log("miliseconds", mili);
     console.log("-------");

     const sec = Math.floor(mili / 1000);
     console.log("seconds", sec);
     console.log("-------");

    const min = Math.floor(sec / 60);
    if (min >= 1) {
        console.log("minutes", min);
        console.log("-------");
    }

     const hou = Math.floor(min / 60);
     if (hou >= 1) {
         console.log("hours", hou);
         console.log("-------");
     }

     const day = Math.floor(hou / 24);
     if (day >= 1) {
         console.log("days", day);
         console.log("-------");
     }

     if (soknadHendelser) {
         console.log(
             "Det tok saken",
             day,
             "dag(er)",
             hou - day * 24,
             "time(r)",
             min - day * 24 * 60,
             "minutt(er) og",
             sec - day * 24 * 60 * 60,
             "sekund(er)",
             "før saken fikk status ferdigbehandlet"
         );
     }
*/

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
