"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyShort, Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { ReactNode, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Metadata } from "@components/filopplasting/new/types";
import { useDocumentState } from "@components/filopplasting/new/api/useDocumentState";
import useSendVedleggHelperTus from "@components/filopplasting/new/api/useSendVedleggHelperTus";
import FileSelectNew from "@components/filopplasting/new/FileSelectNew";
import UploadedFileList from "@components/filopplasting/new/UploadedFileList";

interface Props {
    metadata: Metadata;
    label?: string;
    description?: string;
    tag?: ReactNode;
    completed?: boolean;
    id: string;
}

const OpplastingsboksTus = ({ metadata, label, description, tag, completed, id }: Props) => {
    const t = useTranslations("Opplastingsboks");
    const docState = useDocumentState(id);
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const {
        upload,
        resetMutation,
        isPending,
        isUploadSuccess,
        error: mutationError,
    } = useSendVedleggHelperTus(metadata);
    const liveRegionRef = useRef<HTMLDivElement>(null);

    // Move focus to live region when upload completes to prevent "leaving main content" announcement
    useEffect(() => {
        if (isUploadSuccess && liveRegionRef.current) {
            liveRegionRef.current.focus();
        }
    }, [isUploadSuccess]);

    if (completed) {
        return (
            <VStack gap="2">
                <Box.New>
                    <HStack align="center" justify="space-between">
                        <Heading size="small" level="3" lang="no">
                            {label ?? t("tittel")}
                        </Heading>
                        {tag}
                    </HStack>
                    <BodyShort>{description ?? t("beskrivelse")}</BodyShort>
                </Box.New>
                <UploadedFileList fiksDigisosId={fiksDigisosId} oppgaveId={metadata.hendelsereferanse} />
                {isUploadSuccess && (
                    <Alert role="alert" closeButton onClose={resetMutation} variant="success">
                        {t("suksess")}
                    </Alert>
                )}
            </VStack>
        );
    }

    return (
        <>
            <FileSelectNew label={label} description={description} tag={tag} docState={docState} uploadId={id} />
            {!!docState.uploads?.length && (
                <Button
                    onClick={() => upload(docState.documentId!)}
                    loading={isPending}
                    className="self-start mt-4"
                    disabled={
                        isPending ||
                        docState.uploads?.some((upload) => (upload.validations?.length ?? 0) > 0 || !upload.signedUrl)
                    }
                >
                    {t("sendInn")}
                </Button>
            )}
            {isUploadSuccess && (
                <Alert role="alert" variant="success">
                    {t("suksess")}
                </Alert>
            )}
            {mutationError && (
                <Alert role="alert" variant="error">
                    {t("error")}
                </Alert>
            )}
        </>
    );
};

export default OpplastingsboksTus;
