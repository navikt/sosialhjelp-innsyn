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

export const logSoknadBehandlingsTid = (hendelser?: HendelseResponse[]) => {
    console.log("hendelser", hendelser);

    let newestSoknadFerdigbehandlet;
    let newestSoknadUnderBehandling;
    const soknadUnderBehandling = hendelser?.filter(
        (item) =>
            item.hendelseType === "SOKNAD_UNDER_BEHANDLING_UTEN_TITTEL" ||
            "SOKNAD_MOTTATT_MED_KOMMUNENAVN" ||
            "SOKNAD_SEND_TIL_KONTOR"
    );
    if (soknadUnderBehandling && soknadUnderBehandling.length > 0) {
        newestSoknadUnderBehandling = soknadUnderBehandling.reduce((a, b) =>
            new Date(a.tidspunkt) > new Date(b.tidspunkt) ? a : b
        );
    }

    const soknadFerdigbehandlet = hendelser?.filter(
        (item) =>
            item.hendelseType === "SOKNAD_UNDER_BEHANDLING_UTEN_TITTEL" ||
            "SOKNAD_MOTTATT_MED_KOMMUNENAVN" ||
            "SOKNAD_SEND_TIL_KONTOR"
    );
    if (soknadFerdigbehandlet && soknadFerdigbehandlet.length > 0) {
        newestSoknadFerdigbehandlet = soknadFerdigbehandlet.reduce((a, b) =>
            new Date(a.tidspunkt) > new Date(b.tidspunkt) ? a : b
        );
    }

    if (soknadUnderBehandling && soknadFerdigbehandlet) {
        const msDay = 24 * 60 * 60 * 1000;

        const soknadUnderBehandling: Date = new Date(newestSoknadUnderBehandling?.tidspunkt ?? "");
        const soknadFerdigbehandletTid: Date = new Date(newestSoknadFerdigbehandlet?.tidspunkt ?? "");
        console.log(
            "(ferdig-sendt)/msday",
            Math.ceil((soknadFerdigbehandletTid?.getTime() - soknadUnderBehandling?.getTime()) / msDay)
        );

        //TODO: VI MÅ INKLUDERE KOMMUNENUMMER I log
        //logAmplitudeEvent("Klikk på knapp eller lenke", {
        //    msDay,
        //});
    }
};

export const logSakBehandlingsTidUtenTittel = (hendelser?: HendelseResponse[]) => {
    let groupSaksBasedOnSaksReferanse;
    if (hendelser && Object.keys(hendelser).length > 0) {
        groupSaksBasedOnSaksReferanse = hendelser?.reduce((group: {[key: string]: HendelseResponse[]}, item, num) => {
            if (!group[item.saksReferanse]) {
                group[item.saksReferanse] = [];
            }
            group[item.saksReferanse].push(item);
            return group;
        }, {});
    }

    let newestSakFerdigbehandletUtenTittel;
    let newestSakUnderBehandlingUtenTittel;
    for (const saksReferanse in groupSaksBasedOnSaksReferanse) {
        const events = groupSaksBasedOnSaksReferanse[saksReferanse];

        const sakUnderBehandlingUtenTittel = events.filter(
            (item) => item.hendelseType === "SAK_UNDER_BEHANDLING_UTEN_TITTEL"
        );
        if (sakUnderBehandlingUtenTittel.length > 0) {
            newestSakUnderBehandlingUtenTittel = sakUnderBehandlingUtenTittel.reduce((a, b) =>
                new Date(a.tidspunkt) > new Date(b.tidspunkt) ? a : b
            );
        }

        const sakFerdigbehandletUtenTittel = events.filter(
            (event) => event.hendelseType === "SAK_FERDIGBEHANDLET_UTEN_TITTEL"
        );
        if (sakFerdigbehandletUtenTittel.length > 0) {
            newestSakFerdigbehandletUtenTittel = sakFerdigbehandletUtenTittel.reduce((a, b) =>
                new Date(a.tidspunkt) > new Date(b.tidspunkt) ? a : b
            );
        }

        if (newestSakFerdigbehandletUtenTittel && newestSakFerdigbehandletUtenTittel) {
            const tidspunkt1 = new Date(newestSakFerdigbehandletUtenTittel.tidspunkt);
            const tidspunkt2 = new Date(newestSakFerdigbehandletUtenTittel.tidspunkt);
            const msDay = 24 * 60 * 60 * 1000;

            const timeDifferenceInDays = Math.ceil((tidspunkt2.getTime() - tidspunkt1.getTime()) / msDay);
            console.log("Time difference in days:", timeDifferenceInDays);
        }
    }
};

export const logSakBehandlingsTidMedTittel = (hendelser?: HendelseResponse[]) => {
    let groupSaksBasedOnSaksReferanse;
    if (hendelser && Object.keys(hendelser).length > 0) {
        groupSaksBasedOnSaksReferanse = hendelser?.reduce((group: {[key: string]: HendelseResponse[]}, item, num) => {
            if (!group[item.saksReferanse]) {
                group[item.saksReferanse] = [];
            }
            group[item.saksReferanse].push(item);
            return group;
        }, {});
    }
    console.log("groupSaksBasedOnSaksReferanse", groupSaksBasedOnSaksReferanse);

    let newestSakFerdigbehandletMedTittel;
    for (const saksReferanse in groupSaksBasedOnSaksReferanse) {
        const events = groupSaksBasedOnSaksReferanse[saksReferanse];

        const sakUnderBehandlingMedTittel = events.find(
            (item) => item.hendelseType === "SAK_UNDER_BEHANDLING_MED_TITTEL"
        );

        const sakFerdigbehandletMedTittel = events.filter(
            (event) => event.hendelseType === "SAK_FERDIGBEHANDLET_MED_TITTEL"
        );
        if (sakFerdigbehandletMedTittel.length > 0) {
            newestSakFerdigbehandletMedTittel = sakFerdigbehandletMedTittel.reduce((a, b) =>
                new Date(a.tidspunkt) > new Date(b.tidspunkt) ? a : b
            );
        }

        if (newestSakFerdigbehandletMedTittel && sakUnderBehandlingMedTittel) {
            const tidspunkt1 = new Date(sakUnderBehandlingMedTittel.tidspunkt);
            const tidspunkt2 = new Date(newestSakFerdigbehandletMedTittel.tidspunkt);
            const msDay = 24 * 60 * 60 * 1000;

            const timeDifferenceInDays = Math.ceil((tidspunkt2.getTime() - tidspunkt1.getTime()) / msDay);
            console.log("time diff", timeDifferenceInDays);
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
