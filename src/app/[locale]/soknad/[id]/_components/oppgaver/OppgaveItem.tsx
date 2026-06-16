"use client";

import { forwardRef, Ref } from "react";
import OpplastingsboksOld from "@components/filopplasting/OpplastingsboksOld";
import OpplastingsboksTus from "@components/filopplasting/OpplastingsboksTus";
import { getVisningstekster } from "@utils/getVisningsteksterForVedlegg";
import { Metadata } from "@components/filopplasting/types";
import { OppgaveResponseBeta } from "@generated/model";
import TaskListItem from "../tasklistitem/TaskListItem";
import OppgaveTag from "../tasklistitem/OppgaveTag";
import { useParams } from "next/navigation";
import useNewUploadEnabled from "@components/filopplasting/utils/useNewUploadEnabled";
import { useContextId } from "@components/filopplasting/utils/useContextId";

interface Props {
    oppgave: OppgaveResponseBeta;
}

const withWarningColor = (text: string | undefined) =>
    text ? (
        <span lang="no" className="text-ax-text-warning">
            {text}
        </span>
    ) : undefined;

const OppgaveItem = ({ oppgave }: Props, ref: Ref<HTMLLIElement>) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const newUploadEnabled = useNewUploadEnabled();

    const rawContextId = oppgave.hendelsereferanse
        ? `${fiksDigisosId}-${oppgave.hendelsereferanse}`
        : `${fiksDigisosId}-${oppgave.dokumenttype ?? ""}-${oppgave.tilleggsinformasjon ?? ""}`;
    const contextId = useContextId(rawContextId);

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
            {contextId &&
                (newUploadEnabled ? (
                    <OpplastingsboksTus
                        uploadContextId={contextId}
                        completed={oppgave.erLastetOpp}
                        label={typeTekst}
                        description={tilleggsinfoTekst}
                        tag={<OppgaveTag frist={oppgave.innsendelsesfrist} completed={oppgave.erLastetOpp} />}
                        metadata={metadata}
                        variant={!oppgave.erLastetOpp && oppgave.erFraInnsyn ? "warning" : undefined}
                    />
                ) : (
                    <OpplastingsboksOld
                        metadata={metadata}
                        completed={oppgave.erLastetOpp}
                        label={!oppgave.erLastetOpp && oppgave.erFraInnsyn ? withWarningColor(typeTekst) : typeTekst}
                        labelText={typeTekst}
                        description={
                            !oppgave.erLastetOpp && oppgave.erFraInnsyn
                                ? withWarningColor(tilleggsinfoTekst)
                                : tilleggsinfoTekst
                        }
                        tag={<OppgaveTag frist={oppgave.innsendelsesfrist} completed={oppgave.erLastetOpp} />}
                    />
                ))}
        </TaskListItem>
    );
};

export default forwardRef(OppgaveItem);
