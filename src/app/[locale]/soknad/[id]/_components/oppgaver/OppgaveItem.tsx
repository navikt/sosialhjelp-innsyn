"use client";

import { forwardRef, Ref } from "react";
import Opplastingsboks from "@components/filopplasting/Opplastingsboks";
import OpplastingsboksTus from "@components/filopplasting/OpplastingsboksTus";
import { getVisningstekster } from "@utils/getVisningsteksterForVedlegg";
import { useFlag } from "@featuretoggles/context";
import { Metadata } from "@components/filopplasting/types";
import { OppgaveResponseBeta } from "@generated/model";
import TaskListItem from "../tasklistitem/TaskListItem";
import OppgaveTag from "../tasklistitem/OppgaveTag";

interface Props {
    oppgave: OppgaveResponseBeta;
}

const withWarningColor = (text: string | undefined) => <span className="text-ax-text-warning">{text}</span>;

const OppgaveItem = ({ oppgave }: Props, ref: Ref<HTMLLIElement>) => {
    const toggle = useFlag("sosialhjelp.innsyn.ny_upload");
    const newUploadEnabled = toggle?.enabled ?? false;

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
                    id={oppgave.oppgaveId}
                    completed={oppgave.erLastetOpp}
                    label={typeTekst}
                    description={tilleggsinfoTekst}
                    tag={<OppgaveTag frist={oppgave.innsendelsesfrist} completed={oppgave.erLastetOpp} />}
                    metadata={metadata}
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
