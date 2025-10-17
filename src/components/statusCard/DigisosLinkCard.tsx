import Link from "next/link";
import { LinkCard, LinkCardTitle, LinkCardDescription, LinkCardAnchor } from "@navikt/ds-react/LinkCard";
import React, { JSX, PropsWithChildren, ReactNode } from "react";
import cx from "classnames";
import { ArrowRightIcon, DownloadIcon, ExpandIcon } from "@navikt/aksel-icons";

import Ikon from "@components/statusCard/Ikon";

export interface Props {
    href: string;
    description?: ReactNode;
    icon?: JSX.Element;
    variant?: "info" | "warning";
    dashed?: boolean;
    cardIcon?: "download" | "expand";
    underline?: boolean;
}

const RightIkon = (fil?: string) => {
    switch (fil) {
        case "download":
            return (
                <DownloadIcon
                    fontSize="1.75rem"
                    className="navds-link-anchor__arrow pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                />
            );
        case "expand":
            return (
                <ExpandIcon
                    fontSize="1.75rem"
                    className="navds-link-anchor__arrow pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                />
            );
        default:
            return (
                <ArrowRightIcon
                    fontSize="1.75rem"
                    className="navds-link-anchor__arrow pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                />
            );
    }
};

const DigisosLinkCard = ({
    href,
    children,
    description,
    icon,
    variant = "info",
    dashed,
    cardIcon,
    underline = false,
}: PropsWithChildren<Props>) => (
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
        {icon && <Ikon variant={variant} icon={icon} />}
        <LinkCardTitle className="items-center">
            <LinkCardAnchor
                asChild
                className={cx(underline ? "underline group-hover:no-underline" : "no-underline group-hover:underline")}
            >
                <Link href={href}>{children}</Link>
            </LinkCardAnchor>
        </LinkCardTitle>
        {description && <LinkCardDescription>{description}</LinkCardDescription>}
        {RightIkon(cardIcon)}
    </LinkCard>
);

export default DigisosLinkCard;
