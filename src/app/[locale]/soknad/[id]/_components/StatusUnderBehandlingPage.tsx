import { getTranslations } from "next-intl/server";

import StatusAlert from "@components/alert/StatusAlert";
import { getOppgaver } from "@generated/ssr/oppgave-controller/oppgave-controller";

import { StatusPage } from "./StatusPage";
import Oppgaver from "./oppgaver/Oppgaver";

interface Props {
    navKontor: string;
    id: string;
}

export const StatusUnderBehandlingPage = async ({ navKontor, id }: Props) => {
    const t = await getTranslations("StatusUnderBehandlingPage");

    const oppgaver = await getOppgaver(id);
    const oppgaveElementer = oppgaver.flatMap((oppgave) =>
        oppgave.oppgaveElementer.map((oppgaveElement) => ({ ...oppgaveElement, frist: oppgave.innsendelsesfrist }))
    );
    return (
        <StatusPage
            id={id}
            heading={t("tittel")}
            alert={
                oppgaver.length > 0 ? (
                    <StatusAlert
                        variant="warning"
                        tittel={t.rich("alert.tittel", {
                            navKontor: navKontor,
                            norsk: (chunks) => <span lang="no">{chunks}</span>,
                        })}
                        beskrivelse={t("alert.beskrivelse")}
                    />
                ) : null
            }
        >
            <Oppgaver oppgaver={oppgaveElementer} />
        </StatusPage>
    );
};
