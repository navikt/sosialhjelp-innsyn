import React from "react";
import {Tag} from "@navikt/ds-react";
import {SoknadsStatusEnum} from "./soknadsStatusUtils";
import {useTranslation} from "react-i18next";

interface Props {
    status: null | SoknadsStatusEnum;
}
const SoknadsStatusTag = ({status}: Props) => {
    const {t} = useTranslation();

    switch (status) {
        case SoknadsStatusEnum.SENDT:
            return <Tag variant="info">{t("soknadstatus.sendt")}</Tag>;
        case SoknadsStatusEnum.MOTTATT:
            return <Tag variant="info">{t("soknadstatus.mottatt")}</Tag>;

        case SoknadsStatusEnum.UNDER_BEHANDLING:
            return <Tag variant="info">{t("soknadstatus.under_behandling")}</Tag>;

        case SoknadsStatusEnum.FERDIGBEHANDLET:
            return <Tag variant="success">{t("soknadstatus.ferdigbehandlet")}</Tag>;
    }
    return null;
};
export default SoknadsStatusTag;
