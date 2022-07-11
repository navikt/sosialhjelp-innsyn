import React from "react";
import {Tag} from "@navikt/ds-react";
import {SoknadsStatusEnum} from "./soknadsStatusUtils";
import {IntlShape} from "react-intl";

interface Props {
    status: null | SoknadsStatusEnum;
    intl: IntlShape;
}
const SoknadsStatusTag = ({status, intl}: Props) => {
    switch (status) {
        case SoknadsStatusEnum.SENDT:
            return <Tag variant="warning">{intl.formatMessage({id: "soknadstatus.sendt"})}</Tag>;
        case SoknadsStatusEnum.MOTTATT:
            return <Tag variant="warning">{intl.formatMessage({id: "soknadstatus.mottatt"})}</Tag>;

        case SoknadsStatusEnum.UNDER_BEHANDLING:
            return <Tag variant="warning">{intl.formatMessage({id: "soknadstatus.under_behandling"})}</Tag>;

        case SoknadsStatusEnum.FERDIGBEHANDLET:
            return <Tag variant="success">{intl.formatMessage({id: "soknadstatus.ferdigbehandlet"})}</Tag>;
    }
    return null;
};
export default SoknadsStatusTag;
