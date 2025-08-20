import { Alert, AlertProps, Heading } from "@navikt/ds-react";
import { ReactNode } from "react";

interface Props {
    variant: AlertProps["variant"];
    tittel: ReactNode;
    beskrivelse: ReactNode;
}

const StatusAlert = ({ variant, tittel, beskrivelse }: Props) => (
    <Alert variant={variant}>
        <Heading size="small" level="2">
            {tittel}
        </Heading>
        {beskrivelse}
    </Alert>
);

export default StatusAlert;
