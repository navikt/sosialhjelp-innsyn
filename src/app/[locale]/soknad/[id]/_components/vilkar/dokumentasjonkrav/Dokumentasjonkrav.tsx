"use client";

import { Tag } from "@navikt/ds-react";
import OpplastingsboksTus from "@components/filopplasting/new/OpplastingsboksTus";
import TaskListItem from "../../tasklistitem/TaskListItem";
import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";
import { useTranslations } from "next-intl";
import { DokumentasjonkravDto } from "@generated/model";
import { useFlag } from "@featuretoggles/context";

interface Props {
    dokKrav: DokumentasjonkravDto;
}

const withWarningColor = (text: string | undefined, isUncompleted: boolean) =>
    isUncompleted && text ? <span className="text-ax-text-warning">{text}</span> : text;

const Dokumentasjonkrav = ({ dokKrav }: Props) => {
    const t = useTranslations("Dokumentasjonkrav");
    const toggle = useFlag("sosialhjelp.innsyn.ny_upload");
    const newUploadEnabled = toggle?.enabled ?? false;
    return (
        <TaskListItem completed={dokKrav.erLastetOpp}>
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
                    tag={
                        dokKrav.opplastetDato ? (
                            <Tag variant="success">{t("løst")}</Tag>
                        ) : dokKrav.frist ? (
                            <Tag variant="warning">{t("frist", { frist: new Date(dokKrav.frist) })}</Tag>
                        ) : undefined
                    }
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
                    tag={
                        dokKrav.opplastetDato ? (
                            <Tag variant="success">{t("løst")}</Tag>
                        ) : dokKrav.frist ? (
                            <Tag variant="warning">{t("frist", { frist: new Date(dokKrav.frist) })}</Tag>
                        ) : undefined
                    }
                />
            )}
        </TaskListItem>
    );
};

export default Dokumentasjonkrav;
