import {IntlShape} from "react-intl";

enum SoknadsStatusEnum {
    SENDT = "SENDT",
    MOTTATT = "MOTTATT",
    UNDER_BEHANDLING = "UNDER_BEHANDLING",
    FERDIGBEHANDLET = "FERDIGBEHANDLET",
    BEHANDLES_IKKE = "BEHANDLES_IKKE",
}

enum SaksStatusEnum {
    BEHANDLES_IKKE = "BEHANDLES IKKE",
    IKKE_INNSYN = "IKKE INNSYN",
}

const soknadsStatusTittel = (status: string | null | SoknadsStatusEnum, intl: IntlShape): string => {
    switch (status) {
        case SoknadsStatusEnum.SENDT:
            return intl.formatMessage({id: "status.sendt"});
        case SoknadsStatusEnum.MOTTATT:
            return intl.formatMessage({id: "status.mottatt"});
        case SoknadsStatusEnum.UNDER_BEHANDLING:
            return intl.formatMessage({id: "status.under_behandling"});
        case SoknadsStatusEnum.FERDIGBEHANDLET:
            return intl.formatMessage({id: "status.ferdigbehandlet"});
        case SoknadsStatusEnum.BEHANDLES_IKKE:
            return intl.formatMessage({id: "status.behandles_ikke"});
    }
    return "Søknad";
};
export const soknadsStatusTag = (status: string | null | SoknadsStatusEnum, intl: IntlShape): string => {
    switch (status) {
        case SoknadsStatusEnum.SENDT:
            return intl.formatMessage({id: "soknadstatus.sendt"});
        case SoknadsStatusEnum.MOTTATT:
            return intl.formatMessage({id: "soknadstatus.mottatt"});
        case SoknadsStatusEnum.UNDER_BEHANDLING:
            return intl.formatMessage({id: "soknadstatus.under_behandling"});
        case SoknadsStatusEnum.FERDIGBEHANDLET:
        case SoknadsStatusEnum.BEHANDLES_IKKE:
            return intl.formatMessage({id: "soknadstatus.ferdigbehandlet"});
    }
    return intl.formatMessage({id: "soknadstatus.sendt"});
};

export {SoknadsStatusEnum, SaksStatusEnum, soknadsStatusTittel};
