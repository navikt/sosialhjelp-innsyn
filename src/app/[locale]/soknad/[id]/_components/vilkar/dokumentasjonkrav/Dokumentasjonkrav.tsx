"use client";

import { Box, Tag } from "@navikt/ds-react";
import OpplastingsboksTus from "@components/filopplasting/new/OpplastingsboksTus";
import Opplastingsboks from "@components/filopplasting/new/Opplastingsboks";
import { useTranslations } from "next-intl";
import { DokumentasjonkravDto } from "@generated/model";
import { useFlag } from "@featuretoggles/context";

interface Props {
    dokKrav: DokumentasjonkravDto;
}

const Dokumentasjonkrav = ({ dokKrav }: Props) => {
    const t = useTranslations("Dokumentasjonkrav");
    const toggle = useFlag("sosialhjelp.innsyn.ny_upload");
    const newUploadEnabled = toggle?.enabled ?? false;
    return (
        <Box
            as="li"
            key={dokKrav.dokumentasjonkravId}
            background="neutral-soft"
            padding={{ xs: "space-16", sm: "space-24" }}
            borderRadius="12"
        >
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
            )}
        </Box>
    );
};

export default Dokumentasjonkrav;
