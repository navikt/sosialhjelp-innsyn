import { getTranslations } from "next-intl/server";

import StatusAlert from "../alert/StatusAlert";
import { getOppgaver } from "../../generated/ssr/oppgave-controller/oppgave-controller";

import { StatusPage } from "./StatusPage";

interface Props {
    navKontor: string;
    id: string;
}

export const StatusUnderBehandlingPage = async ({ navKontor, id }: Props) => {
    const t = await getTranslations("StatusUnderBehandlingPage");

    const harEtterspurteDokumenter = await getOppgaver(id);

    const AlertStatus = () => (
        <StatusAlert
            variant="warning"
            tittel={t.rich("alert.tittel", {
                navKontor: navKontor,
                norsk: (chunks) => <span lang="no">{chunks}</span>,
            })}
            beskrivelse={t("alert.beskrivelse")}
        />
    );

    return <StatusPage heading={t("tittel")} alert={harEtterspurteDokumenter.data.length > 0 ? AlertStatus() : null} />;
};
