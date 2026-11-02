"use client";

import { Button, VStack } from "@navikt/ds-react";
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
    const { state: docState, resetState, addUploads, removeUpload, hasFiles, canSubmit } = useDocumentState(contextId);
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

    return (
        <VStack gap="space-16">
            <FileSelectNew
                label={t("opplastingTittel")}
                description={t("opplastingBeskrivelse")}
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
            {hasFiles && (
                <Button
                    onClick={() => upload(docState.submissionId!)}
                    loading={isPending}
                    className="self-start"
                    disabled={!canSubmit || isPending}
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
