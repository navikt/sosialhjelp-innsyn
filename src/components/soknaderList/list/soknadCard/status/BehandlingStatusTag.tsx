import { InboxIcon, PersonGavelIcon, CheckmarkIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import { Tag } from "@navikt/ds-react";

import { BehandlingsStatus } from "./StatusCard";

export type VedtakProgress = {
    ferdigeSaker: number;
    antallSaker: number;
};

interface Props {
    status?: BehandlingsStatus;
    vedtakProgress?: VedtakProgress;
}

const BehandlingsStatusTag = ({ status, vedtakProgress }: Props) => {
    const t = useTranslations("StatusCard.BehandlingsStatus");

    // If vedtakProgress is provided, show vedtak count instead of status
    if (vedtakProgress) {
        const { ferdigeSaker, antallSaker } = vedtakProgress;

        return (
            <Tag variant="info-moderate" size="small">
                {t("nSakerFerdig", {
                    ferdigeSaker,
                    antallSaker,
                })}
            </Tag>
        );
    }

    switch (status) {
        case "mottatt":
            return (
                <Tag variant="info-moderate" size="small" icon={<InboxIcon />}>
                    {t("mottatt")}
                </Tag>
            );
        case "under_behandling":
            return (
                <Tag variant="info-moderate" size="small" icon={<PersonGavelIcon />}>
                    {t("underBehandling")}
                </Tag>
            );
        case "ferdigbehandlet_nylig":
            return (
                <Tag variant="info-moderate" size="small" icon={<CheckmarkIcon />}>
                    {t("ferdigbehandlet")}
                </Tag>
            );
        case "ferdigbehandlet_eldre":
            return (
                <Tag variant="neutral-moderate" size="small" icon={<CheckmarkIcon />}>
                    {t("ferdigbehandlet")}
                </Tag>
            );
        default:
            return null;
    }
};

export default BehandlingsStatusTag;
