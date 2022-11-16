import amplitude from "amplitude-js";
import {DokumentasjonEtterspurt} from "../redux/innsynsdata/innsynsdataReducer";

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
            if (amplitude) {
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

export const logDuplicationsOfUploadedAttachmentsForDokEtterspurt = (
    dokumentasjonEtterspurt: DokumentasjonEtterspurt,
    externalindex: any
) => {
    if (externalindex === 0) {
        if (dokumentasjonEtterspurt.oppgaveElementer.length > 1) {
            const files = dokumentasjonEtterspurt.oppgaveElementer.flatMap((element) => {
                return element.filer ?? [];
            });
            if (files.length > 1) {
                let duplikerteFiler: File[] = [];
                files.forEach((el, i) => {
                    files.forEach((element, index) => {
                        if (i === index) {
                            return null;
                        }
                        if (el.file && element.filnavn === el.filnavn) {
                            if (
                                element.file?.lastModified === el.file.lastModified &&
                                element.file?.size === el.file.size &&
                                element.file?.name === el.file.name &&
                                element.file?.type === el.file.type
                            ) {
                                if (el.file && !duplikerteFiler.includes(el.file)) {
                                    duplikerteFiler.push(el.file);
                                }
                            }
                        }
                    });
                });
                if (duplikerteFiler.length > 0) {
                    logAmplitudeEvent("Nylig lagt til vedlegg er duplikert ");
                }
            }
        }
    }
};
