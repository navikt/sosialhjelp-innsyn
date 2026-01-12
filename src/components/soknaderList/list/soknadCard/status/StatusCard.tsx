"use client";

import { PropsWithChildren } from "react";
import DigisosLinkCard, { Props } from "@components/statusCard/DigisosLinkCard";
import { useFlag } from "@featuretoggles/context";

type StatusCardProps = Omit<PropsWithChildren<Props>, "href"> & {
    id: string;
    tittel: string;
    ariaTittel: string;
};

const StatusCard = (props: PropsWithChildren<StatusCardProps>) => {
    const { tittel, ariaTittel, children } = props;
    const nySoknadSideToggle = useFlag("sosialhjelp.innsyn.ny_soknadside");

    const href = nySoknadSideToggle.enabled ? `/soknad/${props.id}` : `/${props.id}/status`;

    return (
        <DigisosLinkCard href={href} footer={children} {...props}>
            <span lang="nb">{tittel}</span>
            <span className="sr-only">{ariaTittel}</span>
        </DigisosLinkCard>
    );
};

export default StatusCard;
