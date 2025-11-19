"use client";
import { PropsWithChildren } from "react";
import { useLocale, useTranslations } from "next-intl";

import DigisosLinkCard, { Props, Tag } from "@components/statusCard/DigisosLinkCard";
import { useFlag } from "@featuretoggles/context";

export type BehandlingsStatus = "mottatt" | "under_behandling" | "ferdigbehandlet_nylig" | "ferdigbehandlet_eldre";

type VedtakProgress = {
    ferdigeSaker: number;
    antallSaker: number;
};

type StatusCardProps = Omit<PropsWithChildren<Props>, "href"> & {
    id: string;
    tittel: string;
    sendtDato?: Date;
    behandlingsStatus?: BehandlingsStatus;
    vedtakProgress?: VedtakProgress;
    alertTexts?: string[];
};

const getBehandlingsStatusTag = (
    t: (key: string) => string,
    status?: BehandlingsStatus,
    vedtakProgress?: VedtakProgress
): Tag | null => {
    // If vedtakProgress is provided, show vedtak count instead of status
    if (vedtakProgress) {
        const { ferdigeSaker, antallSaker } = vedtakProgress;
        return {
            title: `${ferdigeSaker} av ${antallSaker} saker ferdig behandlet`,
            variant: "info-moderate" as const,
        };
    }

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
    const { tittel, sendtDato, behandlingsStatus, vedtakProgress, alertTexts } = props;
    const nySoknadSideToggle = useFlag("sosialhjelp.innsyn.ny_soknadside");
    const locale = useLocale();
    const t = useTranslations("StatusCard");

    const href = nySoknadSideToggle.enabled ? `/${locale}/soknad/${props.id}` : `/${locale}/${props.id}/status`;

    const sendtTag = sendtDato
        ? { title: t("sendt", { dato: sendtDato }), variant: "neutral-moderate" as const }
        : null;

    const alertTags = alertTexts?.map((text) => ({ title: text, variant: "warning-moderate" as const })) ?? [];

    const tags = [sendtTag, getBehandlingsStatusTag(t, behandlingsStatus, vedtakProgress)]
        .concat(alertTags)
        .filter((tag) => tag != null);

    return (
        <DigisosLinkCard href={href} tags={tags} {...props}>
            <span lang="nb">{tittel}</span>
        </DigisosLinkCard>
    );
};

export default StatusCard;
