import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import {onLanguageSelect} from "@navikt/nav-dekoratoren-moduler";
import Cookies from "js-cookie";
import {isLocalhost} from "../utils/restUtils";
import nb from "./nb.json";

let language = Cookies.get("decorator-language");
if (language === undefined || !["nb", "nn"].includes(language)) {
    language = "nb";
}
// noinspection JSIgnoredPromiseFromCall
i18n.use(initReactI18next).init({
    fallbackLng: "nb",
    lng: language,
    supportedLngs: ["nb"],
    debug: isLocalhost(window.location.href),
    resources: {
        nb: {
            translation: nb,
        },
    },
});

onLanguageSelect(async (language) => {
    const handleError = (err: unknown) => {
        if (err) {
            console.error(err);
        }
    };
    await i18n.changeLanguage(language.locale, handleError).catch(handleError);
});

export default i18n;
