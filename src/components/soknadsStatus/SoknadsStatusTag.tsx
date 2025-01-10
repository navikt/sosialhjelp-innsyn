import React from "react";
import {Tag as DS_Tag, TagProps} from "@navikt/ds-react";
import {useTranslation} from "next-i18next";
import styled from "styled-components";

import {SoknadsStatusResponseStatus} from "../../generated/model";

const StyledAlertTag = styled(DS_Tag)`
    border-radius: 6px;
`;
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

const Tag = ({children, ...rest}: TagProps): React.JSX.Element => {
    const {t} = useTranslation();
    return (
        <StyledAlertTag {...rest}>
            <span className="sr-only">{t("status")}: </span>
            {children}
        </StyledAlertTag>
    );
};

export default SoknadsStatusTag;
