"use client";

import { forwardRef, Ref } from "react";
import OpplastingsboksTus from "@components/filopplasting/OpplastingsboksTus";
import { useVisningstekster } from "@hooks/useVisningstekster";
import { Metadata } from "@components/filopplasting/types";
import { OppgaveResponseBeta } from "@generated/model";
import TaskListItem from "../tasklistitem/TaskListItem";
import OppgaveTag from "../tasklistitem/OppgaveTag";
import { useParams } from "next/navigation";
import { useContextId } from "@components/filopplasting/utils/useContextId";

interface Props {
    oppgave: OppgaveResponseBeta;
}

const OppgaveItem = ({ oppgave }: Props, ref: Ref<HTMLLIElement>) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();

    const rawContextId = oppgave.hendelsereferanse
        ? `${fiksDigisosId}-${oppgave.hendelsereferanse}`
        : `${fiksDigisosId}-${oppgave.dokumenttype ?? ""}-${oppgave.tilleggsinformasjon ?? ""}`;
    const contextId = useContextId(rawContextId);

    const getVisningstekster = useVisningstekster();
    const { typeTekst, tilleggsinfoTekst } = getVisningstekster(oppgave.dokumenttype, oppgave.tilleggsinformasjon);
    const metadata: Metadata = {
        dokumentKontekst: "dokumentasjonetterspurt",
        innsendelsesfrist: oppgave.innsendelsesfrist,
        hendelsereferanse: oppgave.hendelsereferanse,
        type: oppgave.dokumenttype,
        tilleggsinfo: oppgave.tilleggsinformasjon,
        hendelsetype: oppgave.hendelsetype,
    };

    return (
        <TaskListItem ref={ref} variant={oppgave.erLastetOpp || !oppgave.erFraInnsyn ? "normal" : "warning"}>
            {contextId && (
                <OpplastingsboksTus
                    uploadContextId={contextId}
                    completed={oppgave.erLastetOpp}
                    label={typeTekst}
                    description={tilleggsinfoTekst}
                    tag={<OppgaveTag frist={oppgave.innsendelsesfrist} completed={oppgave.erLastetOpp} />}
                    metadata={metadata}
                    variant={!oppgave.erLastetOpp && oppgave.erFraInnsyn ? "warning" : undefined}
                />
            )}
        </TaskListItem>
    );
};

export default forwardRef(OppgaveItem);
