import { getTranslations } from "next-intl/server";

import StatusAlert from "../alert/StatusAlert";

import { StatusPage } from "./StatusPage";

interface Props {
    navKontor: string;
    id: string;
}

export const StatusMottattPage = async ({ navKontor, id }: Props) => {
    const t = await getTranslations("StatusMottattPage");
    return (
        <StatusPage
            id={id}
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
