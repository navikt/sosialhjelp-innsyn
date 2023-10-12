import React from "react";
import {Tag} from "@navikt/ds-react";
import {useTranslation} from "next-i18next";
import {SoknadsStatusResponseStatus} from "../../../generated/model";
import styled from "styled-components";

const StyledAlertTag = styled(Tag)`
    border-radius: 6px;
`;
interface Props {
    status: SoknadsStatusResponseStatus | undefined;
}
const SoknadsStatusTag = ({status}: Props) => {
    const {t} = useTranslation();

    switch (status) {
        case SoknadsStatusResponseStatus.SENDT:
            return <StyledAlertTag variant="info">{t("soknadstatus.sendt")}</StyledAlertTag>;
        case SoknadsStatusResponseStatus.MOTTATT:
            return <StyledAlertTag variant="info">{t("soknadstatus.mottatt")}</StyledAlertTag>;

        case SoknadsStatusResponseStatus.UNDER_BEHANDLING:
            return <StyledAlertTag variant="info">{t("soknadstatus.under_behandling")}</StyledAlertTag>;

        case SoknadsStatusResponseStatus.FERDIGBEHANDLET:
            return <StyledAlertTag variant="success">{t("soknadstatus.ferdigbehandlet")}</StyledAlertTag>;
    }
    return null;
};
export default SoknadsStatusTag;
