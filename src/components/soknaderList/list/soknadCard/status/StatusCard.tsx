"use client";

import { PropsWithChildren, ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";
import { Tag } from "@navikt/ds-react";

import DigisosLinkCard, { Props } from "@components/statusCard/DigisosLinkCard";
import { useFlag } from "@featuretoggles/context";

import BehandlingsStatusTag, { BehandlingsStatus, VedtakProgress } from "./BehandlingStatusTag";

type StatusCardProps = Omit<PropsWithChildren<Props>, "href"> & {
    id: string;
    tittel: string;
    sendtDato?: Date;
    behandlingsStatus?: BehandlingsStatus;
    vedtakProgress?: VedtakProgress;
    alertTexts?: string[];
    extraTags?: ReactNode[];
};

const StatusCard = (props: StatusCardProps) => {
    const { tittel, sendtDato, behandlingsStatus, vedtakProgress, extraTags } = props;
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
                    {extraTags?.map((tag) => tag)}
                </LinkCardFooter>
            }
            {...props}
        >
            <span lang="nb">{tittel}</span>
        </DigisosLinkCard>
    );
};

export default StatusCard;
