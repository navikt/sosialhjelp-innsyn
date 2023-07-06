import amplitude from "amplitude-js";

export const initAmplitude = () => {
    if (amplitude) {
        amplitude.getInstance().init("default", "", {
            apiEndpoint: "amplitude.nav.no/collect-auto",
            saveEvents: false,
            includeUtm: true,
            includeReferrer: true,
            platform: window.location.toString(),
        });
    }
};

export function logAmplitudeEvent(eventName: string, eventData?: Record<string, unknown>): void {
    setTimeout(() => {
        try {
            if (amplitude && process.env.NODE_ENV !== "test") {
                amplitude.getInstance().logEvent(eventName, eventData);
            }
        } catch (error) {
            console.error(error);
        }
    });
}

export function fileUploadFailedEvent(errorMessage: string) {
    logAmplitudeEvent("Filopplasting feilet", {errorMessage});
}

export const logButtonOrLinkClick = (tittel: string) => {
    logAmplitudeEvent("Klikk på knapp eller lenke", {
        tittel,
    });
};

export const logServerfeil = (eventData?: Record<string, unknown>) => {
    logAmplitudeEvent("Serverfeil ved lasting av ressurs", eventData);
};

const fullFormLanguageString = (language: string) => {
    switch (language) {
        case "nb":
            return "Norsk bokmål";
        case "nn":
            return "Nynorsk";
        case "en":
            return "Engelsk";
    }
};

export const logBrukerDefaultLanguage = (lang: string) => {
    const language = fullFormLanguageString(lang);
    logAmplitudeEvent("Bruker sin valgte språk før de kommer innom innsyn", {language});
};

export const logBrukerSpraakChange = (lang: string) => {
    const language = fullFormLanguageString(lang);
    logAmplitudeEvent("Bruker har endret språk til: ", {language});
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
