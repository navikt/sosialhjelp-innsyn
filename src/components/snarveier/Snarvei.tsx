import Link from "next/link";
import { LinkPanelTitle } from "@navikt/ds-react/LinkPanel";
import { HStack, LinkPanel } from "@navikt/ds-react";
import { PropsWithChildren } from "react";

interface Props {
    href: string;
}

const Snarvei = ({ href, children }: PropsWithChildren<Props>) => {
    return (
        <LinkPanel as={Link} href={href}>
            <LinkPanelTitle>
                <HStack gap="2" align="center">
                    {children}
                </HStack>
            </LinkPanelTitle>
        </LinkPanel>
    );
};

export default Snarvei;
