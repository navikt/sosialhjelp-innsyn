import { getTranslations } from "next-intl/server";

import { hentHendelser } from "../../generated/ssr/hendelse-controller/hendelse-controller";
import { HendelseResponse } from "../../generated/model";
import AlertStatus from "../alert/AlertStatus";

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
            <AlertStatus
                navKontor={navKontor}
                variant="warning"
                tittel="alert.tittel"
                beskrivelse="alert.beskrivelse"
                trans="StatusUnderBehandlingPage"
            />
        ) : null;

    return <StatusPage heading={t("tittel")} alert={status()} />;
};
