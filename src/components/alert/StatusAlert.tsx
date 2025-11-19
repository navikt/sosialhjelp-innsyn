import { AlertProps, Heading } from "@navikt/ds-react";
import { PropsWithChildren, ReactNode } from "react";

import AlertWithCloseButton from "@components/alert/AlertWithCloseButton";

interface Props {
    variant: AlertProps["variant"];
    tittel: ReactNode;
}

const StatusAlert = ({ variant, tittel, children }: PropsWithChildren<Props>) => (
    <AlertWithCloseButton variant={variant}>
        <Heading size="small" level="2">
            {tittel}
        </Heading>
        {children}
    </AlertWithCloseButton>
);

export default StatusAlert;
