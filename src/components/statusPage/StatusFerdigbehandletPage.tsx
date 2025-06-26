import { getTranslations } from "next-intl/server";
import { Alert, Heading } from "@navikt/ds-react";

import { StatusPage } from "./StatusPage";

interface Props {
    navKontor: string;
}

export const StatusFerdigbehandletPage = async ({ navKontor }: Props) => {
    const t = await getTranslations("StatusFerdigbehandletPage");
    return (
        <StatusPage
            heading={t("tittel")}
            alert={
                <Alert variant="success">
                    <Heading size="small" level="2">
                        {t.rich("alert.tittel", {
                            navKontor: navKontor,
                            norsk: (chunks) => <span lang="no">{chunks}</span>,
                        })}
                    </Heading>
                    {t("alert.beskrivelse")}
                </Alert>
            }
        />
    );
};
