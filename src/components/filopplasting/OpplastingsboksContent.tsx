"use client";

import { BodyLong, Button, HStack, VStack } from "@navikt/ds-react";
import { PaperplaneIcon, XMarkIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";
import { ComponentProps } from "react";
import useIsMobile from "@utils/useIsMobile";
import FileSelectNew from "./FileSelectNew";
import { SubmissionErrorBody } from "./api/submitUpload";
import InlineStatusMessage from "./InlineStatusMessage";

interface Props {
    fileSelectProps: ComponentProps<typeof FileSelectNew>;
    hasFiles: boolean;
    canSubmit: boolean;
    isUploadSuccess: boolean;
    error: unknown;
    onSubmit: () => void;
    resetMutation: () => void;
}

const OpplastingsboksContent = ({
    fileSelectProps,
    hasFiles,
    canSubmit,
    isUploadSuccess,
    error,
    onSubmit,
    resetMutation,
}: Props) => {
    const t = useTranslations("Opplastingsboks");
    const tClose = useTranslations("FilePreviewModal");
    const isMobile = useIsMobile();
    const { isPending } = fileSelectProps;
    const body = error && typeof error === "object" && "errors" in error ? (error as SubmissionErrorBody) : undefined;
    const filesMissing = body?.errors.includes("FILES_MISSING") ?? false;
    const inProgress = body?.errors.includes("UPLOADS_IN_PROGRESS") ?? false;

    return (
        <VStack gap="space-8">
            <FileSelectNew {...fileSelectProps} />
            {!!error && (
                <InlineStatusMessage variant="error" padding="large" fullWidth role="alert">
                    <HStack justify="space-between" align="start" wrap={false}>
                        {filesMissing ? (
                            <VStack gap="space-8">
                                <BodyLong>{t("filesMissing")}</BodyLong>
                                <ul>
                                    {body?.missing?.map((m) => (
                                        <li key={m.uploadId}>{m.originalFilename}</li>
                                    ))}
                                </ul>
                            </VStack>
                        ) : inProgress ? (
                            <BodyLong>{t("uploadsInProgress")}</BodyLong>
                        ) : (
                            <BodyLong>{t("error")}</BodyLong>
                        )}
                        <Button
                            icon={<XMarkIcon aria-hidden />}
                            aria-label={tClose("lukk")}
                            size="small"
                            onClick={resetMutation}
                            data-color="neutral"
                            variant="tertiary-neutral"
                        />
                    </HStack>
                </InlineStatusMessage>
            )}
            {hasFiles && (
                <Button
                    onClick={onSubmit}
                    loading={isPending}
                    className="self-start"
                    disabled={isPending || !canSubmit}
                    icon={<PaperplaneIcon aria-hidden />}
                    iconPosition="right"
                >
                    {t("sendInn")}
                </Button>
            )}
            {isUploadSuccess && (
                <InlineStatusMessage
                    role="status"
                    variant="success"
                    padding="large"
                    size={isMobile ? "small" : "medium"}
                >
                    {t("suksess")}
                </InlineStatusMessage>
            )}
        </VStack>
    );
};

export default OpplastingsboksContent;
