import {logAmplitudeEvent as logDekoratoren} from "@navikt/nav-dekoratoren-moduler";
import {logger} from "@navikt/next-logger";
import {HendelseResponse} from "../generated/model";

export async function logAmplitudeEvent(eventName: string, eventData?: Record<string, unknown>) {
    try {
        await logDekoratoren({
            origin: "sosialhjelpInnsyn",
            eventName,
            eventData: {...eventData, skjemaId: "sosialhjelpInnsyn"},
        });
    } catch (error) {
        logger.warn(`Kunne ikke logge til amplitude: " ${error}`);
    }
}

export function logVeilederBerOmDokumentasjonEvent() {
    logAmplitudeEvent("Veileder ber om dokumentasjon til søknaden");
}
export function logVeilederBerOmDokumentasjonkravEvent() {
    logAmplitudeEvent("Veileder ber om dokumentasjon til stønad/vilkår");
}
export function logSokerFaarVilkaar() {
    logAmplitudeEvent("Søker får vilkår");
}

export function logFileUploadFailedEvent(errorMessage: string) {
    logAmplitudeEvent("Filopplasting feilet", {errorMessage});
}

export const logButtonOrLinkClick = (tittel: string) => {
    logAmplitudeEvent("Klikk på knapp eller lenke", {
        tittel,
    });
};

const msInADay = 24 * 60 * 60 * 1000;

export const logSoknadBehandlingsTid = (hendelser: HendelseResponse[]) => {
    let newestSoknadFerdigbehandlet, newestSoknadUnderBehandling;

    const soknadUnderBehandling = hendelser?.filter(
        (item) =>
            item.hendelseType.includes("SOKNAD_SEND_TIL_KONTOR") ||
            item.hendelseType.includes("SOKNAD_UNDER_BEHANDLING") ||
            item.hendelseType.includes("SOKNAD_MOTTATT_MED_KOMMUNENAVN") ||
            item.hendelseType.includes("SOKNAD_MOTTATT_UTEN_KOMMUNENAVN")
    );

    if (soknadUnderBehandling && soknadUnderBehandling.length > 0) {
        newestSoknadUnderBehandling = soknadUnderBehandling.reduce((a, b) =>
            new Date(a.tidspunkt) < new Date(b.tidspunkt) ? a : b
        );
    }

    const soknadFerdigbehandlet = hendelser?.filter(
        (item) =>
            item.hendelseType.includes("SOKNAD_FERDIGBEHANDLET") || item.hendelseType.includes("SOKNAD_BEHANDLES_IKKE")
    );

    if (soknadFerdigbehandlet && soknadFerdigbehandlet.length > 0) {
        newestSoknadFerdigbehandlet = soknadFerdigbehandlet.reduce((a, b) =>
            new Date(a.tidspunkt) > new Date(b.tidspunkt) ? a : b
        );
    }

    if (newestSoknadUnderBehandling && newestSoknadFerdigbehandlet) {
        const soknadUnderBehandling: Date = new Date(newestSoknadUnderBehandling?.tidspunkt ?? "");
        const soknadFerdigbehandletTid: Date = new Date(newestSoknadFerdigbehandlet?.tidspunkt ?? "");
        const timeDifferenceInDays = Math.ceil(
            (soknadFerdigbehandletTid?.getTime() - soknadUnderBehandling?.getTime()) / msInADay
        );
        console.log("------------------");
        console.log("SØKNAD");
        console.log("antallDager: ", timeDifferenceInDays);
        console.log("kommuneNummer: ", newestSoknadFerdigbehandlet.kommuneNummer);
        console.log("navEnhetsNavn: ", newestSoknadFerdigbehandlet.navEnhetsNavn);
        console.log("navEnhetsNummer: ", newestSoknadFerdigbehandlet.navEnhetsNummer);

        logAmplitudeEvent("Behandlingstid for søknad", {
            antallDager: timeDifferenceInDays,
            kommuneNummer: newestSoknadFerdigbehandlet.kommuneNummer,
            navEnhetsNavn: newestSoknadFerdigbehandlet.navEnhetsNavn,
            navEnhetsNummer: newestSoknadFerdigbehandlet.navEnhetsNummer,
        });
    }
};

export const logSakBehandlingsTidUtenTittel = (hendelser: HendelseResponse[]) => {
    let groupSaksBasedOnSaksReferanse;
    if (hendelser && Object.keys(hendelser).length > 0) {
        groupSaksBasedOnSaksReferanse = hendelser
            .filter((hendelse) => hendelse.saksReferanse !== null || undefined)
            .reduce((group: {[key: string]: HendelseResponse[]}, item, num) => {
                if (!group[item.saksReferanse!]) {
                    group[item.saksReferanse!] = [];
                }
                group[item.saksReferanse!].push(item);
                return group;
            }, {});
    }

    let newestSakFerdigbehandletUtenTittel, oldestSakUnderBehandlingUtenTittel;
    for (const saksReferanse in groupSaksBasedOnSaksReferanse) {
        const events = groupSaksBasedOnSaksReferanse[saksReferanse];

        const sakUnderBehandlingUtenTittel = events.filter(
            (item) => item.hendelseType === "SAK_UNDER_BEHANDLING_UTEN_TITTEL"
        );

        if (sakUnderBehandlingUtenTittel && sakUnderBehandlingUtenTittel.length > 0) {
            console.log("her2");
            oldestSakUnderBehandlingUtenTittel = sakUnderBehandlingUtenTittel.reduce((a, b) =>
                new Date(a.tidspunkt) < new Date(b.tidspunkt) ? a : b
            );
        }

        const sakFerdigbehandletUtenTittel = events.filter(
            (event) => event.hendelseType === "SAK_FERDIGBEHANDLET_UTEN_TITTEL"
        );

        if (sakFerdigbehandletUtenTittel && sakFerdigbehandletUtenTittel.length > 0) {
            newestSakFerdigbehandletUtenTittel = sakFerdigbehandletUtenTittel.reduce((a, b) =>
                new Date(a.tidspunkt) > new Date(b.tidspunkt) ? a : b
            );
        }

        if (oldestSakUnderBehandlingUtenTittel && newestSakFerdigbehandletUtenTittel) {
            const tidspunkt1 = new Date(oldestSakUnderBehandlingUtenTittel.tidspunkt);
            const tidspunkt2 = new Date(newestSakFerdigbehandletUtenTittel.tidspunkt);
            const timeDifferenceInDays = Math.ceil((tidspunkt2.getTime() - tidspunkt1.getTime()) / msInADay);

            //console.log("------------------");
            //console.log("SAK UTEN TITTEL");
            //console.log("antallDager: ", timeDifferenceInDays);
            //console.log("kommuneNummer: ", newestSakFerdigbehandletUtenTittel.kommuneNummer);
            //console.log("navEnhetsNavn: ", newestSakFerdigbehandletUtenTittel.navEnhetsNavn);
            //console.log("navEnhetsNummer: ", newestSakFerdigbehandletUtenTittel.navEnhetsNummer);

            logAmplitudeEvent("Behandlingstid for sak", {
                antallDager: timeDifferenceInDays,
                kommuneNummer: newestSakFerdigbehandletUtenTittel.kommuneNummer,
                navEnhetsNavn: newestSakFerdigbehandletUtenTittel.navEnhetsNavn,
                navEnhetsNummer: newestSakFerdigbehandletUtenTittel.navEnhetsNummer,
            });
        }
    }
};

export const logSakBehandlingsTidMedTittel = (hendelser: HendelseResponse[]) => {
    let groupSaksBasedOnSaksReferanse;
    if (hendelser && Object.keys(hendelser).length > 0) {
        groupSaksBasedOnSaksReferanse = hendelser
            .filter((hendelse) => hendelse.saksReferanse !== null || undefined)
            .reduce((group: {[key: string]: HendelseResponse[]}, item, num) => {
                if (!group[item.saksReferanse!]) {
                    group[item.saksReferanse!] = [];
                }
                group[item.saksReferanse!].push(item);
                return group;
            }, {});
    }

    let newestSakFerdigbehandletMedTittel, oldestSakUnderBehandlingMedTittel;
    for (const saksReferanse in groupSaksBasedOnSaksReferanse) {
        const events = groupSaksBasedOnSaksReferanse[saksReferanse];

        const sakUnderBehandlingMedTittel = events.find(
            (item) => item.hendelseType === "SAK_UNDER_BEHANDLING_MED_TITTEL"
        );

        if (sakUnderBehandlingMedTittel && sakUnderBehandlingMedTittel.length > 0) {
            console.log("her2");
            oldestSakUnderBehandlingMedTittel = sakUnderBehandlingMedTittel.reduce((a, b) =>
                new Date(a.tidspunkt) > new Date(b.tidspunkt) ? a : b
            );
        }

        const sakFerdigbehandletMedTittel = events.filter(
            (event) => event.hendelseType === "SAK_FERDIGBEHANDLET_MED_TITTEL"
        );

        if (sakFerdigbehandletMedTittel.length > 0) {
            newestSakFerdigbehandletMedTittel = sakFerdigbehandletMedTittel.reduce((a, b) =>
                new Date(a.tidspunkt) > new Date(b.tidspunkt) ? a : b
            );
        }

        if (oldestSakUnderBehandlingMedTittel && newestSakFerdigbehandletMedTittel) {
            const tidspunkt1 = new Date(oldestSakUnderBehandlingMedTittel.tidspunkt);
            const tidspunkt2 = new Date(newestSakFerdigbehandletMedTittel.tidspunkt);
            const timeDifferenceInDays = Math.ceil((tidspunkt2.getTime() - tidspunkt1.getTime()) / msInADay);

            //console.log("------------------");
            //console.log("SAK MED TITTEL");
            //console.log("antallDager: ", timeDifferenceInDays);
            //console.log("kommuneNummer: ", newestSakFerdigbehandletMedTittel.kommuneNummer);
            //console.log("navEnhetsNavn: ", newestSakFerdigbehandletMedTittel.navEnhetsNavn);
            //console.log("navEnhetsNummer: ", newestSakFerdigbehandletMedTittel.navEnhetsNummer);
            logAmplitudeEvent("Behandlingstid for sak", {
                antallDager: timeDifferenceInDays,
                kommuneNummer: newestSakFerdigbehandletMedTittel.kommuneNummer,
                navEnhetsNavn: newestSakFerdigbehandletMedTittel.navEnhetsNavn,
                navEnhetsNummer: newestSakFerdigbehandletMedTittel.navEnhetsNummer,
            });
        }
    }
};

const fullFormLanguageString = (language: string | undefined) => {
    switch (language) {
        case "nb":
            return "Norsk bokmål";
        case "nn":
            return "Nynorsk";
        case "en":
            return "Engelsk";
        case undefined:
            return "Ukjent språk";
    }
};

export const logBrukerDefaultLanguage = (lang: string | undefined) => {
    const language = fullFormLanguageString(lang);
    logAmplitudeEvent("Bruker sin valgte språk før de kommer innom innsyn", {language});
};

export const logBrukerSpraakChange = (lang: string) => {
    const language = fullFormLanguageString(lang);
    logAmplitudeEvent("Bruker har endret språk til: ", {language});
};

export const logBrukerLeavingBeforeSubmitting = () => {
    logAmplitudeEvent("Bruker prøver å forlate siden etter de har lagt til vedlegg uten å sende det inn");
};

export const logDuplicatedFiles = (files: File[]) => {
    if (files.length > 1) {
        let duplikerteFiler: File[] = [];
        files.forEach((el, i) => {
            files.forEach((element, index) => {
                if (i === index) {
                    return null;
                }
                if (el && element.name === el.name) {
                    if (
                        element.lastModified === el.lastModified &&
                        element.size === el.size &&
                        element.name === el.name &&
                        element.type === el.type
                    ) {
                        if (el && !duplikerteFiler.includes(el)) {
                            duplikerteFiler.push(el);
                        }
                    }
                }
            });
        });
        if (duplikerteFiler.length > 0) {
            logAmplitudeEvent("Nylig lagt til vedlegg er duplikert ");
        }
    }
};

export const logVilkarDuplications = (vilkar: number, unikVilkar: number) => {
    const antall = vilkar - unikVilkar;
    if (vilkar > unikVilkar) {
        logAmplitudeEvent("Vilkår duplisert", {antall});
    }
};

export const logBrukerAapnerKlageskjema = (tittel: string, spraak: string) => {
    if (spraak.includes("et")) {
        logAmplitudeEvent(tittel, {spraakVersjon: "Norsk bokmål"});
    }
    if (spraak.includes("eit")) {
        logAmplitudeEvent(tittel, {spraakVersjon: "Nynorsk"});
    }
    if (spraak.includes("out")) {
        logAmplitudeEvent(tittel, {spraakVersjon: "Engelsk"});
    }
};
