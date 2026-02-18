"use client";

import SoknadInfoCard from "./SoknadInfoCard";
import { useGetSaksDetaljerSuspense } from "@generated/saks-oversikt-controller/saks-oversikt-controller";
import { useParams } from "next/navigation";
import { useGetOppgaverBetaSuspense } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";

interface Props {
    navKontor?: string;
}

const SoknadInfoCardAdapter = ({ navKontor }: Props) => {
    const { id } = useParams<{ id: string }>();
    const { data: saksdetaljer } = useGetSaksDetaljerSuspense(id);
    const { data: oppgaver } = useGetOppgaverBetaSuspense(id);

    const relevanteOppgaver = oppgaver.filter((oppgave) => !oppgave.erLastetOpp && oppgave.erFraInnsyn);
    const harSakMedFlereVedtak = saksdetaljer.saker?.some((s) => s.antallVedtak > 1) ?? false;

    if (saksdetaljer.status === "SENDT") {
        return <SoknadInfoCard state={{ type: "sendt" }} />;
    }
    if (relevanteOppgaver.length > 0) {
        return (
            <SoknadInfoCard
                state={{
                    type: "oppgaver",
                    oppgaver: oppgaver.map((oppgave) => ({
                        frist: oppgave.innsendelsesfrist ? new Date(oppgave.innsendelsesfrist) : undefined,
                        name: oppgave.dokumenttype,
                    })),
                    navKontor,
                }}
            />
        );
    }
    if (saksdetaljer.status === "MOTTATT" || saksdetaljer.status === "UNDER_BEHANDLING") {
        return <SoknadInfoCard state={{ type: "saksbehandlingstid" }} />;
    }
    if (harSakMedFlereVedtak) {
        return <SoknadInfoCard state={{ type: "nyttVedtak" }} />;
    }

    return null;
};

export default SoknadInfoCardAdapter;
