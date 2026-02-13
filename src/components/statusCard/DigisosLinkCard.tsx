"use client";

import { LinkCard, LinkCardTitle, LinkCardDescription, LinkCardAnchor, LinkCardIcon } from "@navikt/ds-react/LinkCard";
import React, { JSX, PropsWithChildren, ReactNode } from "react";
import { Box, VStack } from "@navikt/ds-react";

import HoyreIkon from "./HoyreIkon";
import { Link } from "@i18n/navigation";
import useIsMobile from "@utils/useIsMobile";

export interface Props {
    href: string;
    description?: ReactNode;
    icon?: JSX.Element;
    cardIcon?: "download" | "expand" | "external-link";
    analyticsEvent?: string;
    analyticsData?: Record<string, unknown>;
    footer?: ReactNode;
    openInNewTab?: boolean;
}

interface IconProps {
    icon: JSX.Element;
}

export const Icon = ({ icon }: IconProps) => (
    <VStack
        justify="center"
        align="center"
        asChild
        className="rounded-xl p-2 bg-ax-bg-accent-soft text-ax-bg-accent-strong"
    >
        <LinkCardIcon>
            <Box asChild className="w-8 h-8 md:h-10 md:w-10">
                {icon}
            </Box>
        </LinkCardIcon>
    </VStack>
);

const DigisosLinkCard = ({
    href,
    children,
    description,
    icon,
    cardIcon,
    analyticsEvent,
    analyticsData,
    footer,
    openInNewTab,
}: PropsWithChildren<Props>) => {
    const isMobile = useIsMobile();
    const size = isMobile ? "small" : "medium";
    const dataAttrs: Record<string, string> = {};
    if (analyticsEvent) {
        dataAttrs["data-umami-event"] = analyticsEvent;
        if (analyticsData) {
            for (const [k, v] of Object.entries(analyticsData)) {
                dataAttrs[`data-umami-event-${k}`] = String(v);
            }
        }
    }

    return (
        <LinkCard arrow={!cardIcon} size={size} data-color={dataColor}>
            {icon && <Icon icon={icon} />}
            <LinkCardTitle className="flex items-center justify-between">
                <LinkCardAnchor asChild>
                    <Link
                        href={href}
                        {...dataAttrs}
                        {...(openInNewTab ? { rel: "noopener noreferrer", target: "_blank" } : {})}
                    >
                        {children}
                    </Link>
                </LinkCardAnchor>
                <HoyreIkon ikon={cardIcon} />
            </LinkCardTitle>
            {description && <LinkCardDescription>{description}</LinkCardDescription>}
            {footer}
        </LinkCard>
    );
};
export default DigisosLinkCard;
