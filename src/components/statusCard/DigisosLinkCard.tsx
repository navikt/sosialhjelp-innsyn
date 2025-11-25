import Link from "next/link";
import { LinkCard, LinkCardTitle, LinkCardDescription, LinkCardAnchor, LinkCardIcon } from "@navikt/ds-react/LinkCard";
import React, { JSX, PropsWithChildren, ReactNode } from "react";
import { Box, VStack } from "@navikt/ds-react";

import HoyreIkon from "./HoyreIkon";

export interface Props {
    href: string;
    description?: ReactNode;
    icon?: JSX.Element;
    cardIcon?: "download" | "expand";
    analyticsEvent?: string;
    analyticsData?: Record<string, unknown>;
    footer?: ReactNode;
}

interface IconProps {
    icon: JSX.Element;
}

export const Icon = ({ icon }: IconProps) => (
    <VStack justify="center" align="center" asChild className="rounded-xl p-4">
        <LinkCardIcon>
            <Box asChild className="w-8 h-8">
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
}: PropsWithChildren<Props>) => {
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
        <LinkCard arrow={!cardIcon}>
            {icon && <Icon icon={icon} />}
            <LinkCardTitle className="flex items-center justify-between">
                <LinkCardAnchor asChild>
                    <Link href={href} {...dataAttrs}>
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
