import {TFunction} from "i18next";

enum SoknadsStatusEnum {
    SENDT = "SENDT",
    MOTTATT = "MOTTATT",
    UNDER_BEHANDLING = "UNDER_BEHANDLING",
    FERDIGBEHANDLET = "FERDIGBEHANDLET",
    BEHANDLES_IKKE = "BEHANDLES_IKKE",
}

const soknadsStatusTittel = (status: string | null | SoknadsStatusEnum, t: TFunction): string => {
    switch (status) {
        case SoknadsStatusEnum.SENDT:
            return t("status.sendt");
        case SoknadsStatusEnum.MOTTATT:
            return t("status.mottatt");
        case SoknadsStatusEnum.UNDER_BEHANDLING:
            return t("status.under_behandling");
        case SoknadsStatusEnum.FERDIGBEHANDLET:
            return t("status.ferdigbehandlet");
        case SoknadsStatusEnum.BEHANDLES_IKKE:
            return t("status.behandles_ikke");
    }
    return "Søknad";
};

export {SoknadsStatusEnum, soknadsStatusTittel};
