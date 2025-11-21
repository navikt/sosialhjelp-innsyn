"use client";

import { ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import { PropsWithChildren } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";
import { Tag } from "@navikt/ds-react";

import DigisosLinkCard, { Props } from "@components/statusCard/DigisosLinkCard";
import { useFlag } from "@featuretoggles/context";

import BehandlingsStatusTag, { VedtakProgress } from "./BehandlingStatusTag";

export type BehandlingsStatus = "mottatt" | "under_behandling" | "ferdigbehandlet_nylig" | "ferdigbehandlet_eldre";

type StatusCardProps = Omit<PropsWithChildren<Props>, "href"> & {
    id: string;
    tittel: string;
    sendtDato?: Date;
    behandlingsStatus?: BehandlingsStatus;
    vedtakProgress?: VedtakProgress;
    alertTexts?: string[];
};

const StatusCard = (props: StatusCardProps) => {
    const { tittel, sendtDato, behandlingsStatus, vedtakProgress, alertTexts } = props;
    const nySoknadSideToggle = useFlag("sosialhjelp.innsyn.ny_soknadside");
    const locale = useLocale();
    const t = useTranslations("StatusCard");

    const href = nySoknadSideToggle.enabled ? `/${locale}/soknad/${props.id}` : `/${locale}/${props.id}/status`;

    return (
        <DigisosLinkCard
            href={href}
            footer={
                <LinkCardFooter>
                    {sendtDato && (
                        <Tag variant="neutral-moderate" size="small">
                            {t("sendt", { dato: sendtDato })}
                        </Tag>
                    )}
                    <BehandlingsStatusTag status={behandlingsStatus} vedtakProgress={vedtakProgress} />
                    {alertTexts &&
                        alertTexts.map((alertText) => (
                            <Tag
                                key={alertText}
                                variant="warning-moderate"
                                size="small"
                                icon={<ExclamationmarkTriangleIcon />}
                            >
                                {alertText}
                            </Tag>
                        ))}
                </LinkCardFooter>
            }
            {...props}
        >
            <span lang="nb">{tittel}</span>
        </DigisosLinkCard>
    );
};

export default StatusCard;
