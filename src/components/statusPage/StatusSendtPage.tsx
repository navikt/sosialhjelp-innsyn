import { getTranslations } from "next-intl/server";

import AlertStatus from "../alert/AlertStatus";

import { StatusPage } from "./StatusPage";

interface Props {
    navKontor: string;
}

export const StatusSendtPage = async ({ navKontor }: Props) => {
    const t = await getTranslations("StatusSendtPage");
    return (
        <StatusPage
            heading={t("tittel")}
            alert={
                <AlertStatus
                    navKontor={navKontor}
                    variant="success"
                    tittel="alert.tittel"
                    beskrivelse="alert.beskrivelse"
                    trans="StatusSendtPage"
                />
            }
        />
    );
};
