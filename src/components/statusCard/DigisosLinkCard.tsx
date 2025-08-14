import Link from "next/link";
import { Box, VStack } from "@navikt/ds-react";
import { LinkCard, LinkCardTitle, LinkCardDescription, LinkCardIcon, LinkCardAnchor } from "@navikt/ds-react/LinkCard";
import { JSX, PropsWithChildren, ReactNode } from "react";
import cx from "classnames";
import { ArrowRightIcon, DownloadIcon } from "@navikt/aksel-icons";

export interface Props {
    href: string;
    description?: ReactNode;
    icon?: JSX.Element;
    variant?: "info" | "warning";
    dashed?: boolean;
    downloadIcon?: boolean;
}

interface IconProps {
    icon: JSX.Element;
    variant?: "info" | "warning";
}

const Icon = ({ icon, variant = "info" }: IconProps) => (
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
    downloadIcon,
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
        {icon && <Icon variant={variant} icon={icon} />}
        <LinkCardTitle className="items-center">
            <LinkCardAnchor asChild className="no-underline group-hover:underline">
                <Link href={href}>{children}</Link>
            </LinkCardAnchor>
        </LinkCardTitle>
        {description && <LinkCardDescription>{description}</LinkCardDescription>}
        {downloadIcon ? (
            <DownloadIcon
                fontSize="1.75rem"
                className="navds-link-anchor__arrow pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            />
        ) : (
            <ArrowRightIcon
                fontSize="1.75rem"
                className="navds-link-anchor__arrow pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
            />
        )}
    </LinkCard>
);
export default DigisosLinkCard;
