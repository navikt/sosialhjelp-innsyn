import { getTranslations } from "next-intl/server";

import AlertStatus from "../alert/AlertStatus";

import { StatusPage } from "./StatusPage";

interface Props {
    navKontor: string;
}

export const StatusMottattPage = async ({ navKontor }: Props) => {
    const t = await getTranslations("StatusMottattPage");
    return (
        <StatusPage
            heading={t("tittel")}
            alert={
                <AlertStatus
                    navKontor={navKontor}
                    variant="success"
                    tittel="alert.tittel"
                    beskrivelse="alert.beskrivelse"
                    trans="StatusMottattPage"
                />
            }
        />
    );
};
