"use client";

import { forwardRef, Ref } from "react";
import Opplastingsboks from "@components/filopplasting/Opplastingsboks";
import OpplastingsboksTus from "@components/filopplasting/OpplastingsboksTus";
import { getVisningstekster } from "@utils/getVisningsteksterForVedlegg";
import { Metadata } from "@components/filopplasting/types";
import { OppgaveResponseBeta } from "@generated/model";
import TaskListItem from "../tasklistitem/TaskListItem";
import OppgaveTag from "../tasklistitem/OppgaveTag";
import { useParams } from "next/navigation";
import useNewUploadEnabled from "@components/filopplasting/utils/useNewUploadEnabled";

interface Props {
    oppgave: OppgaveResponseBeta;
}

// Must be unique per context. Example: One oppgave
const getContextId = (oppgave: OppgaveResponseBeta, fiksDigisosId: string): string => {
    if (oppgave.hendelsereferanse) {
        return `${fiksDigisosId}-${encodeURIComponent(oppgave.hendelsereferanse)}`;
    }
    return `${fiksDigisosId}-${encodeURIComponent(oppgave.dokumenttype ?? "")}-${encodeURIComponent(oppgave.tilleggsinformasjon ?? "")}`;
};

const withWarningColor = (text: string | undefined) => (
    <span lang="no" className="text-ax-text-warning">
        {text}
    </span>
);

const OppgaveItem = ({ oppgave }: Props, ref: Ref<HTMLLIElement>) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const newUploadEnabled = useNewUploadEnabled();

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
            {newUploadEnabled ? (
                <OpplastingsboksTus
                    uploadContextId={getContextId(oppgave, fiksDigisosId)}
                    completed={oppgave.erLastetOpp}
                    label={typeTekst}
                    description={tilleggsinfoTekst}
                    tag={<OppgaveTag frist={oppgave.innsendelsesfrist} completed={oppgave.erLastetOpp} />}
                    metadata={metadata}
                    variant={!oppgave.erLastetOpp && oppgave.erFraInnsyn ? "warning" : undefined}
                />
            ) : (
                <Opplastingsboks
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
            )}
        </TaskListItem>
    );
};

export default forwardRef(OppgaveItem);
