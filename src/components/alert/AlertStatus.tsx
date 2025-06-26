import { Alert, Heading } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

interface Props {
    trans: string;
    variant: "info" | "success" | "warning" | "error";
    tittel: string;
    beskrivelse: string;
    navKontor: string;
}

const AlertStatus = async ({ trans, variant, tittel, beskrivelse, navKontor }: Props) => {
    const t = await getTranslations(trans);

    return (
        <Alert variant={variant}>
            <Heading size="small" level="2">
                {t.rich(tittel, {
                    navKontor: navKontor,
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                })}
            </Heading>
            {t(beskrivelse)}
        </Alert>
    );
};

export default AlertStatus;
