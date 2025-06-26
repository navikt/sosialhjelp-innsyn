import { getTranslations } from "next-intl/server";
import { Alert, Heading } from "@navikt/ds-react";

import { hentHendelser } from "../../generated/ssr/hendelse-controller/hendelse-controller";
import { HendelseResponse } from "../../generated/model";

import { StatusPage } from "./StatusPage";

interface Props {
    navKontor: string;
    id: string;
}

export const StatusUnderBehandlingPage = async ({ navKontor, id }: Props) => {
    const t = await getTranslations("StatusUnderBehandlingPage");
    const etterspurteDokumenter = await hentHendelser(id);

    const status = () =>
        etterspurteDokumenter.data.some(
            (hendelse: HendelseResponse) => hendelse.hendelseType === "ETTERSPOR_MER_DOKUMENTASJON"
        ) ? (
            <Alert variant="warning">
                <Heading size="small" level="2">
                    {t.rich("alert.tittel", {
                        navKontor,
                        norsk: (chunks) => <span lang="no">{chunks}</span>,
                    })}
                </Heading>
                {t("alert.beskrivelse")}
            </Alert>
        ) : null;

    return <StatusPage heading={t("tittel")} alert={status()} />;
};
