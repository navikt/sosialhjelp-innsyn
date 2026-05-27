"use client";

import OpplastingsboksTus from "@components/filopplasting/OpplastingsboksTus";
import TaskListItem from "../../tasklistitem/TaskListItem";
import Opplastingsboks from "@components/filopplasting/Opplastingsboks";
import { DokumentasjonkravDto } from "@generated/model";
import OppgaveTag from "../../tasklistitem/OppgaveTag";
import useNewUploadEnabled from "@components/filopplasting/utils/useNewUploadEnabled";

interface Props {
    dokKrav: DokumentasjonkravDto;
}

const withWarningColor = (text: string | undefined, isUncompleted: boolean) =>
    isUncompleted && text ? <span className="text-ax-text-warning">{text}</span> : text;

const Dokumentasjonkrav = ({ dokKrav }: Props) => {
    const newUploadEnabled = useNewUploadEnabled();
    return (
        <TaskListItem variant={dokKrav.erLastetOpp ? "normal" : "warning"}>
            {newUploadEnabled ? (
                <OpplastingsboksTus
                    id={dokKrav.dokumentasjonkravId}
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
            ) : (
                <Opplastingsboks
                    metadata={{
                        dokumentKontekst: "dokumentasjonkrav",
                        type: dokKrav.tittel ?? "dokumentasjonkrav",
                        tilleggsinfo: dokKrav.beskrivelse,
                        hendelsereferanse: dokKrav.dokumentasjonkravReferanse,
                        hendelsetype: dokKrav.hendelsetype,
                        innsendelsesfrist: dokKrav.frist,
                    }}
                    label={withWarningColor(dokKrav.tittel, !dokKrav.erLastetOpp)}
                    description={withWarningColor(dokKrav.beskrivelse, !dokKrav.erLastetOpp)}
                    completed={dokKrav.erLastetOpp}
                    tag={<OppgaveTag frist={dokKrav.frist} completed={dokKrav.erLastetOpp} />}
                />
            )}
        </TaskListItem>
    );
};

export default Dokumentasjonkrav;
