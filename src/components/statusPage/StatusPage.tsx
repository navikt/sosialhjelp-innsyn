import { PropsWithChildren, ReactNode } from "react";
import { Heading, VStack } from "@navikt/ds-react";

interface Props {
    heading: ReactNode;
    alert?: ReactNode;
}

export const StatusPage = ({ heading, alert, children }: PropsWithChildren<Props>) => {
    return (
        <VStack gap="20" className="mt-20">
            <Heading size="xlarge" level="1">
                {heading}
            </Heading>
            {alert}
            {children}
        </VStack>
    );
};
