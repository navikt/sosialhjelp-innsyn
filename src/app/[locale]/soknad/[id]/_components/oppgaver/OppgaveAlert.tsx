"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import StatusAlert from "@components/alert/StatusAlert";
import { useGetOppgaverBetaSuspense } from "@generated/oppgave-controller/oppgave-controller";

interface Props {
    navKontor: string;
}

const OppgaveAlert = ({ navKontor }: Props) => {
    const { id } = useParams<{ id: string }>();
    const t = useTranslations("OppgaveAlert");
    const { data } = useGetOppgaverBetaSuspense(id);
    if (data.every((oppgave) => oppgave.erLastetOpp)) {
        return null;
    }
    return (
        <StatusAlert
            variant="warning"
            tittel={t.rich("tittel", {
                navKontor,
                norsk: (chunks) => <span lang="no">{chunks}</span>,
            })}
            beskrivelse={t("beskrivelse")}
        />
    );
};

export default OppgaveAlert;
