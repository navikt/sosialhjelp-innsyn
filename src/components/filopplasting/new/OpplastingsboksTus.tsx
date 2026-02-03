"use client";

import { useTranslations } from "next-intl";
import { BodyShort, Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { ReactNode, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Metadata } from "@components/filopplasting/new/types";
import { useDocumentState } from "@components/filopplasting/new/api/useDocumentState";
import useSendVedleggHelperTus from "@components/filopplasting/new/api/useSendVedleggHelperTus";
import FileSelectNew from "@components/filopplasting/new/FileSelectNew";
import UploadedFileList from "@components/filopplasting/new/UploadedFileList";
import AccessibleAlert, { LiveRegion } from "@components/filopplasting/new/AccessibleAlert";

interface Props {
    metadata: Metadata;
    label?: string;
    description?: ReactNode;
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
                    <AccessibleAlert closeButton onClose={resetMutation} variant="success">
                        {t("suksess")}
                    </AccessibleAlert>
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
            <LiveRegion ref={liveRegionRef} variant={mutationError ? "error" : "success"}>
                {isUploadSuccess && <AccessibleAlert variant="success">{t("suksess")}</AccessibleAlert>}
                {mutationError && <AccessibleAlert variant="error">{t("error")}</AccessibleAlert>}
            </LiveRegion>
        </>
    );
};

export default OpplastingsboksTus;
