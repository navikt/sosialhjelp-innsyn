import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {onLanguageSelect} from "@navikt/nav-dekoratoren-moduler";
import Cookies from "js-cookie";
import {isLocalhost} from "../utils/restUtils";
import nb from "./nb/nb.json";
import nn from "./nn/nn.json";
import en from "./en/en.json";
import {logBrukerDefaultLanguage, logBrukerSpraakChange} from "../utils/amplitude";

let language = Cookies.get("decorator-language");
if (language === undefined || !["nb", "nn", "en"].includes(language)) {
    language = "nb";
}
if (["nb", "nn", "en"].includes(language)) {
    logBrukerDefaultLanguage(language);
}
// noinspection JSIgnoredPromiseFromCall
i18n.use(initReactI18next).init({
    fallbackLng: "nb",
    lng: language,
    supportedLngs: ["nb", "nn", "en"],
    debug: isLocalhost(window.location.href),
    resources: {
        nb: {
            utbetalinger: require("./nb/utbetalinger.json"),
            global: nb,
        },
        nn: {
            utbetalinger: require("./nn/utbetalinger.json"),
            global: nn,
        },
        en: {
            utbetalinger: require("./en/utbetalinger.json"),
            global: en,
        },
    },
    defaultNS: "global",
    ns: ["utbetalinger", "global"],
});

onLanguageSelect(async (language) => {
    logBrukerSpraakChange(language.locale);
    const handleError = (err: unknown) => {
        if (err) {
            console.error(err);
        }
    };
    await i18n.changeLanguage(language.locale, handleError).catch(handleError);
});

export default i18n;
