import {TFunction} from "i18next";
import {SoknadsStatusResponseStatus} from "../../generated/model";

const soknadsStatusTittel = (status: SoknadsStatusResponseStatus | undefined, t: TFunction): string => {
    switch (status) {
        case SoknadsStatusResponseStatus.SENDT:
            return t("status.sendt");
        case SoknadsStatusResponseStatus.MOTTATT:
            return t("status.mottatt");
        case SoknadsStatusResponseStatus.UNDER_BEHANDLING:
            return t("status.under_behandling");
        case SoknadsStatusResponseStatus.FERDIGBEHANDLET:
            return t("status.ferdigbehandlet");
        case SoknadsStatusResponseStatus.BEHANDLES_IKKE:
            return t("status.behandles_ikke");
    }
    return "Søknad";
};

export {soknadsStatusTittel};
