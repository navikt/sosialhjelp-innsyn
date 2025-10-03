"use client";

import { useTranslations } from "next-intl";
import { Alert, BodyShort, Box, Button, Heading, HStack, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";

import { Metadata } from "@components/filopplasting/new/types";
import { useDocumentState } from "@components/filopplasting/new/api/useDocumentState";
import useSendVedleggHelperTus from "@components/filopplasting/new/api/useSendVedleggHelperTus";

import FileSelect from "./FileSelect";

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
    const {
        upload,
        resetMutation,
        isPending,
        isUploadSuccess,
        error: mutationError,
    } = useSendVedleggHelperTus(metadata);

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
                {isUploadSuccess && (
                    <Alert closeButton onClose={resetMutation} variant="success">
                        {t("suksess")}
                    </Alert>
                )}
            </VStack>
        );
    }

    return (
        <>
            <FileSelect label={label} description={description} tag={tag} docState={docState} uploadId={id} />
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
            {isUploadSuccess && <Alert variant="success">{t("suksess")}</Alert>}
            {mutationError && <Alert variant="error">{t("error")}</Alert>}
        </>
    );
};

export default OpplastingsboksTus;
