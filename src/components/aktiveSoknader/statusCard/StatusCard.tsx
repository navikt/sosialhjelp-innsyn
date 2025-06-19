"use client";
import Link from "next/link";
import { Box, Heading, HStack, VStack } from "@navikt/ds-react";
import { PropsWithChildren, ReactNode } from "react";
import { LinkPanelTitle, LinkPanel, LinkPanelDescription } from "@navikt/ds-react/LinkPanel";
import cx from "classnames";

interface Props {
    href: string;
    description?: ReactNode;
    icon?: ReactNode;
    variant?: "info" | "warning";
    dashed?: boolean;
}

interface IconProps {
    icon?: ReactNode;
    variant?: "info" | "warning";
}

const Icon = ({ icon, variant = "info" }: IconProps) => {
    if (!icon) {
        return null;
    }
    return (
        <Box
            padding="3"
            borderRadius="12"
            borderWidth="0"
            className={
                variant === "info"
                    ? "text-custom-accent-subtle bg-custom-accent-subtle group-hover:text-custom-accent-strong-hover group-hover:bg-custom-accent-moderateA/10"
                    : "text-custom-warning-subtle bg-custom-warning-moderate group-hover:bg-custom-warning-moderateA/20"
            }
        >
            {icon}
        </Box>
    );
};

const StatusCard = ({ href, children, description, icon, variant = "info", dashed }: PropsWithChildren<Props>) => (
    <LinkPanel
        as={Link}
        href={href}
        className={cx(
            "group rounded-2xl focus:border-custom-border-accent hover:shadow-none",
            variant === "info"
                ? "border-custom-neutral-subtle hover:bg-custom-neutral-soft"
                : "border-custom-warning-subtle bg-custom-warning-soft hover:bg-custom-warning-moderate hover:border-custom-warning-subtle",
            dashed && "border-dashed"
        )}
    >
        <LinkPanelTitle className="hover:text-custom-neutral">
            <HStack gap="4" align="center" wrap={false}>
                <Icon icon={icon} variant={variant} />
                <VStack className="text-custom-neutral">
                    <Heading level="3" size="small">
                        {children}
                    </Heading>
                    {description && <LinkPanelDescription className="mt-0">{description}</LinkPanelDescription>}
                </VStack>
            </HStack>
        </LinkPanelTitle>
    </LinkPanel>
);

export default StatusCard;
