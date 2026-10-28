"use client";

import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { PaperplaneIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import { useState } from "react";
import FileSelectNew from "@components/filopplasting/FileSelectNew";
import InlineStatusMessage from "@components/filopplasting/InlineStatusMessage";
import { useDocumentState } from "@components/filopplasting/api/useDocumentState";
import useSendKlageEttersendelseTus from "@components/filopplasting/api/useSendKlageEttersendelseTus";
import { umamiCustomTrack } from "../../../../../umami";

interface Props {
    fiksDigisosId: string;
    klageId: string;
    contextId: string;
}

const KlageEttersendelse = ({ fiksDigisosId, klageId, contextId }: Props) => {
    const t = useTranslations("KlagePage.ettersendelse");
    const tUpload = useTranslations("Opplastingsboks");
    const [navEksternRefId, setNavEksternRefId] = useState(() => crypto.randomUUID());
    const { state: docState, resetState, addUploads, removeUpload } = useDocumentState(contextId);
    const { upload, resetMutation, isPending, isUploadSuccess, error } = useSendKlageEttersendelseTus(
        fiksDigisosId,
        klageId,
        () => {
            resetState();
            setNavEksternRefId(crypto.randomUUID());
        },
        () =>
            umamiCustomTrack("opplasting fullført", {
                uploadVariant: "tus",
                dokumentKontekst: "klage-ettersendelse",
                digisosId: fiksDigisosId,
                antallDokumenter: docState.uploads?.length ?? 0,
            })
    );

    const kanSendeInn =
        !!docState.submissionId &&
        !!docState.uploads?.length &&
        !docState.uploads.some((vedlegg) => (vedlegg.validations?.length ?? 0) > 0 || !vedlegg.filId) &&
        (docState.validations?.length ?? 0) === 0;

    return (
        <VStack gap="space-16">
            <VStack gap="space-8">
                <Heading size="medium" level="2">
                    {t("tittel")}
                </Heading>
                <BodyLong>{t("beskrivelse")}</BodyLong>
            </VStack>
            <FileSelectNew
                docState={docState}
                contextId={contextId}
                target={{ type: "klage", klageId, navEksternRefId }}
                onSelect={(files) => {
                    if (!isPending) {
                        resetMutation();
                    }
                    umamiCustomTrack("opplasting startet", {
                        uploadVariant: "tus",
                        dokumentKontekst: "klage-ettersendelse",
                        digisosId: fiksDigisosId,
                        antallDokumenter: files.length,
                    });
                }}
                onUploadsAdded={addUploads}
                onUploadRemoved={removeUpload}
                isPending={isPending}
                headingLevel="3"
            />
            {error && (
                <InlineStatusMessage variant="error" padding="large" fullWidth role="alert">
                    {tUpload("error")}
                </InlineStatusMessage>
            )}
            {!!docState.uploads?.length && (
                <Button
                    onClick={() => upload(docState.submissionId!)}
                    loading={isPending}
                    className="self-start"
                    disabled={!kanSendeInn || isPending}
                    icon={<PaperplaneIcon aria-hidden />}
                    iconPosition="right"
                >
                    {tUpload("sendInn")}
                </Button>
            )}
            {isUploadSuccess && (
                <InlineStatusMessage variant="success" padding="large" role="status">
                    {tUpload("suksess")}
                </InlineStatusMessage>
            )}
        </VStack>
    );
};

export default KlageEttersendelse;
