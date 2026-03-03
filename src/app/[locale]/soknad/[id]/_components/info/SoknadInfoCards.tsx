"use client";

import SoknadInfoCard from "./SoknadInfoCard";
import { useGetSaksDetaljerSuspense } from "@generated/saks-oversikt-controller/saks-oversikt-controller";
import { useParams } from "next/navigation";
import { useGetOppgaverBetaSuspense } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import { JSX } from "react";
import { VStack } from "@navikt/ds-react";

interface Props {
    navKontor?: string;
}

const SoknadInfoCards = ({ navKontor }: Props) => {
    const { id } = useParams<{ id: string }>();
    const { data: saksdetaljer } = useGetSaksDetaljerSuspense(id);
    const { data: oppgaver } = useGetOppgaverBetaSuspense(id);

    const relevanteOppgaver = oppgaver.filter((oppgave) => !oppgave.erLastetOpp && oppgave.erFraInnsyn);
    const harSakMedFlereVedtak = saksdetaljer.saker?.some((s) => s.antallVedtak > 1) ?? false;
    const cards: JSX.Element[] = [];

    if (saksdetaljer.status === "SENDT") {
        cards.push(<SoknadInfoCard key="sendt" state={{ type: "sendt" }} />);
    }
    if (relevanteOppgaver.length > 0) {
        cards.push(
            <SoknadInfoCard
                key="oppgaver"
                state={{
                    type: "oppgaver",
                    oppgaver: relevanteOppgaver.map((oppgave) => ({
                        id: oppgave.oppgaveId,
                        frist: oppgave.innsendelsesfrist ? new Date(oppgave.innsendelsesfrist) : undefined,
                        name: oppgave.dokumenttype,
                    })),
                    navKontor,
                }}
            />
        );
    }

    if (harSakMedFlereVedtak) {
        cards.push(<SoknadInfoCard key="nyttVedtak" state={{ type: "nyttVedtak" }} />);
    }
    if (saksdetaljer.status === "MOTTATT" || saksdetaljer.status === "UNDER_BEHANDLING") {
        if (saksdetaljer.forelopigSvar?.harMottattForelopigSvar) {
            cards.push(
                <SoknadInfoCard
                    key="forelopigSvar"
                    state={{ type: "forelopigSvar", forelopigSvarUrl: saksdetaljer.forelopigSvar.link }}
                />
            );
        } else if (cards.length === 0) {
            cards.push(<SoknadInfoCard key="saksbehandlingstid" state={{ type: "saksbehandlingstid" }} />);
        }
    }

    if (cards.length === 0) {
        return null;
    }
    if (cards.length === 1) {
        return cards[0];
    }
    return <VStack gap="space-8">{cards}</VStack>;
};

export default SoknadInfoCards;
