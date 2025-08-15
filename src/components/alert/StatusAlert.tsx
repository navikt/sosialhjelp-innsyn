import { Alert, Heading } from "@navikt/ds-react";
import { ReactNode } from "react";

interface Props {
    variant: "info" | "success" | "warning" | "error";
    tittel: ReactNode;
    beskrivelse: string;
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
