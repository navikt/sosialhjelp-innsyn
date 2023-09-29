import React from "react";
import {Tag} from "@navikt/ds-react";
import {useTranslation} from "next-i18next";
import {SoknadsStatusResponseStatus} from "../../generated/model";

interface Props {
    status: SoknadsStatusResponseStatus | undefined;
}
const SoknadsStatusTag = ({status}: Props) => {
    const {t} = useTranslation();

    switch (status) {
        case SoknadsStatusResponseStatus.SENDT:
            return <Tag variant="info">{t("soknadstatus.sendt")}</Tag>;
        case SoknadsStatusResponseStatus.MOTTATT:
            return <Tag variant="info">{t("soknadstatus.mottatt")}</Tag>;

        case SoknadsStatusResponseStatus.UNDER_BEHANDLING:
            return <Tag variant="info">{t("soknadstatus.under_behandling")}</Tag>;

        case SoknadsStatusResponseStatus.FERDIGBEHANDLET:
            return <Tag variant="success">{t("soknadstatus.ferdigbehandlet")}</Tag>;
    }
    return null;
};
export default SoknadsStatusTag;
