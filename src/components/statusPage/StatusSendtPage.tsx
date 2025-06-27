import { getTranslations } from "next-intl/server";

import StatusAlert from "../alert/StatusAlert";

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
                <StatusAlert
                    variant="success"
                    tittel={t.rich("alert.tittel", {
                        navKontor: navKontor,
                        norsk: (chunks) => <span lang="no">{chunks}</span>,
                    })}
                    beskrivelse={t("alert.beskrivelse")}
                />
            }
        />
    );
};
