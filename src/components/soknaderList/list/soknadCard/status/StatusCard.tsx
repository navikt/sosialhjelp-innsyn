"use client";
import { PropsWithChildren } from "react";
import { useLocale, useTranslations } from "next-intl";

import DigisosLinkCard, { Props } from "@components/statusCard/DigisosLinkCard";
import { useFlag } from "@featuretoggles/context";

type BehandlingsStatus = "mottatt" | "under_behandling" | "ferdigbehandlet_nylig" | "ferdigbehandlet_eldre";

type StatusCardProps = Omit<PropsWithChildren<Props>, "href"> & {
    id: string;
    tittel: string;
    sendtDato?: Date;
    behandlingsStatus?: BehandlingsStatus;
    alertText?: string;
};

const getBehandlingsStatusTag = (t: (key: string) => string, status?: BehandlingsStatus) => {
    switch (status) {
        case "mottatt":
            return { title: t("BehandlingsStatus.mottatt"), variant: "info-moderate" as const };
        case "under_behandling":
            return { title: t("BehandlingsStatus.underBehandling"), variant: "info-moderate" as const };
        case "ferdigbehandlet_nylig":
            return { title: t("BehandlingsStatus.ferdigbehandlet"), variant: "info-moderate" as const };
        case "ferdigbehandlet_eldre":
            return { title: t("BehandlingsStatus.ferdigbehandlet"), variant: "neutral-moderate" as const };
        default:
            return null;
    }
};

const StatusCard = (props: StatusCardProps) => {
    const { tittel, sendtDato, behandlingsStatus, alertText } = props;
    const nySoknadSideToggle = useFlag("sosialhjelp.innsyn.ny_soknadside");
    const locale = useLocale();
    const t = useTranslations("StatusCard");

    const href = nySoknadSideToggle.enabled ? `/${locale}/soknad/${props.id}` : `/${locale}/${props.id}/status`;

    const sendtTag = sendtDato
        ? { title: t("sendt", { dato: sendtDato }), variant: "neutral-moderate" as const }
        : null;

    const alertTag = alertText ? { title: alertText, variant: "warning-moderate" as const } : null;

    const tags = [sendtTag, getBehandlingsStatusTag(t, behandlingsStatus), alertTag].filter((tag) => tag != null);
    return (
        <DigisosLinkCard href={href} tags={tags} {...props}>
            <span lang="nb">{tittel}</span>
        </DigisosLinkCard>
    );
};

export default StatusCard;
