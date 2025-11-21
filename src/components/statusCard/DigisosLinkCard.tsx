import Link from "next/link";
import { LinkCard, LinkCardTitle, LinkCardDescription, LinkCardAnchor, LinkCardIcon } from "@navikt/ds-react/LinkCard";
import React, { JSX, PropsWithChildren, ReactNode } from "react";
import cx from "classnames";
import { Box, VStack } from "@navikt/ds-react";

import HoyreIkon from "./HoyreIkon";

export interface Props {
    href: string;
    description?: ReactNode;
    icon?: JSX.Element;
    variant?: "info" | "warning";
    dashed?: boolean;
    cardIcon?: "download" | "expand";
    underline?: boolean;
    analyticsEvent?: string;
    analyticsData?: Record<string, unknown>;
    footer?: ReactNode;
}

interface IconProps {
    icon: JSX.Element;
    variant?: "info" | "warning";
}

export const Icon = ({ icon, variant = "info" }: IconProps) => (
    <VStack
        justify="center"
        align="center"
        asChild
        className={cx(
            "rounded-xl p-4",
            variant === "info"
                ? "bg-ax-bg-accent-soft text-ax-bg-accent-strong group-hover:bg-ax-bg-accent-moderate group-hover:text-ax-bg-accent-strong-hover"
                : "bg-ax-bg-warning-moderate text-ax-text-warning-subtle group-hover:bg-ax-bg-warning-moderate-a group-hover:text-ax-text-warning-subtle"
        )}
    >
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
    variant = "info",
    dashed,
    cardIcon,
    underline = false,
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
        <LinkCard
            arrow={false}
            className={cx(
                "group hover:shadow-none focus:shadow-none focus:border-ax-border-accent",
                dashed ? "border-dashed " : "",
                variant === "info"
                    ? "border-ax-border-neutral-subtle hover:bg-ax-bg-neutral-soft hover:border-ax-border-neutral-subtle"
                    : "border-ax-border-warning-subtle bg-ax-bg-warning-soft hover:bg-ax-bg-warning-moderate"
            )}
        >
            {icon && <Icon variant={variant} icon={icon} />}
            <LinkCardTitle className="items-center">
                <LinkCardAnchor
                    asChild
                    className={cx(
                        underline ? "underline group-hover:no-underline" : "no-underline group-hover:underline"
                    )}
                >
                    <Link href={href} {...dataAttrs}>
                        {children}
                    </Link>
                </LinkCardAnchor>
            </LinkCardTitle>
            {description && <LinkCardDescription>{description}</LinkCardDescription>}
            <HoyreIkon ikon={cardIcon} />
            {footer}
        </LinkCard>
    );
};
export default DigisosLinkCard;
