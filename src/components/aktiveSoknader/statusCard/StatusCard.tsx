"use client";
import Link from "next/link";
import { Box, HStack, VStack } from "@navikt/ds-react";
import { PropsWithChildren, ReactNode } from "react";
import { LinkPanelTitle, LinkPanel, LinkPanelDescription } from "@navikt/ds-react/LinkPanel";
import cx from "classnames";

interface Props {
    href?: string;
    description?: ReactNode;
    icon?: ReactNode;
    variant?: "info" | "warning";
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
            padding="2"
            borderRadius="12"
            borderWidth="0"
            className={
                variant === "info"
                    ? "text-custom-accent-subtle bg-custom-accent-subtle"
                    : "text-custom-warning-subtle bg-custom-warning-moderate"
            }
        >
            {icon}
        </Box>
    );
};

const StatusCard = ({ href, children, description, icon, variant = "info" }: PropsWithChildren<Props>) => {
    return (
        <LinkPanel
            as={Link}
            href={href}
            className={cx(
                "rounded-2xl",
                variant === "info"
                    ? "border-custom-neutral-subtle"
                    : "border-custom-warning-subtle bg-custom-warning-soft"
            )}
        >
            <LinkPanelTitle>
                <HStack gap="4" align="center" wrap={false}>
                    <Icon icon={icon} variant={variant} />
                    <VStack>
                        {children}
                        {description && <LinkPanelDescription>{description}</LinkPanelDescription>}
                    </VStack>
                </HStack>
            </LinkPanelTitle>
        </LinkPanel>
    );
};

export default StatusCard;
