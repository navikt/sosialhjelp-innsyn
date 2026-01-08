import { InboxIcon, PersonGavelIcon, CheckmarkIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import { Tag } from "@navikt/ds-react";

export type BehandlingsStatus = "mottatt" | "under_behandling" | "ferdigbehandlet_nylig" | "ferdigbehandlet_eldre";

export type VedtakProgress = {
    ferdigeSaker: number;
    antallSaker: number;
};

interface Props {
    status?: BehandlingsStatus;
    vedtakProgress?: VedtakProgress;
}

const BehandlingsStatusTag = ({ status, vedtakProgress }: Props) => {
    const t = useTranslations("BehandlingsStatus");

    if (vedtakProgress) {
        const { ferdigeSaker, antallSaker } = vedtakProgress;

        return (
            <Tag variant="info-moderate" size="small" icon={<PersonGavelIcon aria-hidden="true" />}>
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
                <Tag variant="info-moderate" size="small" icon={<InboxIcon aria-hidden="true" />}>
                    {t("mottatt")}
                </Tag>
            );
        case "under_behandling":
            return (
                <Tag variant="info-moderate" size="small" icon={<PersonGavelIcon aria-hidden="true" />}>
                    {t("underBehandling")}
                </Tag>
            );
        case "ferdigbehandlet_nylig":
            return (
                <Tag variant="info-moderate" size="small" icon={<CheckmarkIcon aria-hidden="true" />}>
                    {t("ferdigbehandlet")}
                </Tag>
            );
        case "ferdigbehandlet_eldre":
            return (
                <Tag variant="neutral-moderate" size="small" icon={<CheckmarkIcon aria-hidden="true" />}>
                    {t("ferdigbehandlet")}
                </Tag>
            );
        default:
            return null;
    }
};

export default BehandlingsStatusTag;
