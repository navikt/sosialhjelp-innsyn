import { AlertProps, Heading } from "@navikt/ds-react";
import { ReactNode } from "react";

import AlertWithCloseButton from "@components/alert/AlertWithCloseButton";

interface Props {
    variant: AlertProps["variant"];
    tittel: ReactNode;
    beskrivelse: ReactNode;
}

const StatusAlert = ({ variant, tittel, beskrivelse }: Props) => (
    <AlertWithCloseButton variant={variant}>
        <Heading size="small" level="2">
            {tittel}
        </Heading>
        {beskrivelse}
    </AlertWithCloseButton>
);

export default StatusAlert;
