import {logAmplitudeEvent as logDekoratoren} from "@navikt/nav-dekoratoren-moduler";
import {logger} from "@navikt/next-logger";

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

export function logVeilederBerOmDokumentasjonEvent(vedleggAntallet: number) {
    logAmplitudeEvent("Veileder ber om dokumentasjon til søknaden", {AntallVedleggForesporsel: vedleggAntallet});
}
export function logVeilederBerOmDokumentasjonOgAntallVedleggSomLastesOppEvent(vedleggAntallet: number) {
    logAmplitudeEvent("Veileder ber om dokumentasjon til søknaden, og hvor mange vedlegg som må lastes opp", {
        AntallVedleggForesporsel: vedleggAntallet,
    });
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
