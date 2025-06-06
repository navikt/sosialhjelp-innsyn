import Link from "next/link";
import { HStack } from "@navikt/ds-react";
import { PropsWithChildren, ReactNode } from "react";
import { LinkPanelTitle, LinkPanel, LinkPanelDescription } from "@navikt/ds-react/LinkPanel";

interface Props {
    href?: string;
    description?: ReactNode;
}

const StatusCard = ({ href, children, description }: PropsWithChildren<Props>) => {
    return (
        <LinkPanel as={Link} href={href}>
            <LinkPanelTitle>
                <HStack gap="2" align="center">
                    {children}
                </HStack>
            </LinkPanelTitle>
            {description && <LinkPanelDescription>{description}</LinkPanelDescription>}
        </LinkPanel>
    );
};

export default StatusCard;
