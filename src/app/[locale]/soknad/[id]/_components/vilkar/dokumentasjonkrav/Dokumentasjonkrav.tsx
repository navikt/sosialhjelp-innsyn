"use client";

import OpplastingsboksTus from "@components/filopplasting/OpplastingsboksTus";
import TaskListItem from "../../tasklistitem/TaskListItem";
import { DokumentasjonkravDto } from "@generated/model";
import OppgaveTag from "../../tasklistitem/OppgaveTag";
import { useContextId } from "@components/filopplasting/utils/useContextId";
import { useParams } from "next/navigation";

interface Props {
    dokKrav: DokumentasjonkravDto;
}

const Dokumentasjonkrav = ({ dokKrav }: Props) => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const contextId = useContextId(`${fiksDigisosId}-${dokKrav.dokumentasjonkravId}`);
    return (
        <TaskListItem variant={dokKrav.erLastetOpp ? "normal" : "warning"}>
            {contextId && (
                <OpplastingsboksTus
                    uploadContextId={contextId}
                    metadata={{
                        dokumentKontekst: "dokumentasjonkrav",
                        type: dokKrav.tittel ?? "dokumentasjonkrav",
                        tilleggsinfo: dokKrav.beskrivelse,
                        hendelsereferanse: dokKrav.dokumentasjonkravReferanse,
                        hendelsetype: dokKrav.hendelsetype,
                        innsendelsesfrist: dokKrav.frist,
                    }}
                    label={dokKrav.tittel}
                    description={dokKrav.beskrivelse}
                    completed={dokKrav.erLastetOpp}
                    variant={dokKrav.erLastetOpp ? undefined : "warning"}
                    tag={<OppgaveTag frist={dokKrav.frist} completed={!!dokKrav.opplastetDato} />}
                />
            )}
        </TaskListItem>
    );
};

export default Dokumentasjonkrav;
