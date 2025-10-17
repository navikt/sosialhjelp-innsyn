import { JSX } from "react";
import { Box, VStack } from "@navikt/ds-react";
import cx from "classnames";
import { LinkCardIcon } from "@navikt/ds-react/LinkCard";

interface IconProps {
    icon: JSX.Element;
    variant?: "info" | "warning";
}

const Ikon = ({ icon, variant = "info" }: IconProps) => (
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

export default Ikon;
