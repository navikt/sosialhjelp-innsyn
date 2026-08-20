import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { FileUpload } from "@navikt/ds-react/FileUpload";
import { Upload } from "tus-js-client";
import { BodyShort, Button, HStack, Loader } from "@navikt/ds-react";
import { InformationSquareFillIcon, TrashIcon, XMarkIcon } from "@navikt/aksel-icons";
import { browserEnv } from "@config/env";
import { UploadStatus, ValidationCode } from "@components/filopplasting/api/useDocumentState";

interface Props {
    originalFilename: string;
    convertedFilename?: string;
    uploadId: string;
    validations?: ValidationCode[];
    url?: string;
    status: UploadStatus;
    size?: number;
    showCancelButton?: boolean;
    onTerminate?: () => void;
    deleteDisabled?: boolean;
}

const SeOverDescription = () => {
    const t = useTranslations("FileUploadItem");
    return (
        <HStack align="center" gap="space-8" className="text-ax-text-info-subtle">
            <InformationSquareFillIcon aria-hidden />
            <BodyShort>{t("seOver")}</BodyShort>
        </HStack>
    );
};

const FileUploadItem = ({
    convertedFilename,
    originalFilename,
    uploadId,
    validations,
    url,
    status,
    size,
    showCancelButton,
    onTerminate,
    deleteDisabled,
}: Props) => {
    const t = useTranslations("FileUploadItem");
    const { mutate, isPending } = useMutation({
        mutationFn: () => Upload.terminate(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files/${uploadId}`, {}),
        onSuccess: () => onTerminate?.(),
        retry: false,
    });
    const isConverted = !!convertedFilename && convertedFilename !== originalFilename;
    const isUploading = !url && !validations && status !== "FAILED" && status !== "COMPLETE" && !showCancelButton;
    const uploadStatus = isUploading ? "uploading" : "idle";

    // Vi bruker ikke loading-prop på slett-knappen fordi Aksel sin Button setter
    // native disabled-attributtet når loading=true. Nettleseren blur'er da
    // automatisk et disabled element, noe som gjør at VoiceOver mister fokuset
    // og hopper til <body> — akkurat det vi prøver å unngå.
    // Istedenfor viser vi Loader-ikonet manuelt og bruker aria-disabled for å
    // hindre dobbelklikk, uten å sette native disabled på DOM-noden.
    const isDeleting = isPending && !showCancelButton;

    return (
        <>
            <FileUpload.Item
                file={{ name: convertedFilename ?? originalFilename, size }}
                as="li"
                status={uploadStatus}
                button={
                    <HStack align="center" gap="space-4">
                        {showCancelButton && <Loader />}
                        <Button
                            variant="tertiary"
                            data-color="neutral"
                            icon={
                                isDeleting ? (
                                    <Loader size="xsmall" />
                                ) : showCancelButton ? (
                                    <XMarkIcon title={t("cancel")} />
                                ) : (
                                    <TrashIcon title={t("slett")} />
                                )
                            }
                            onClick={() => {
                                if (!isDeleting) mutate();
                            }}
                            disabled={deleteDisabled}
                            loading={showCancelButton ? isPending : false}
                            aria-disabled={isDeleting || deleteDisabled}
                        />
                    </HStack>
                }
                onFileClick={url ? () => window.open(url, "_blank", "noopener,noreferrer") : undefined}
                /* @ts-expect-error Funker fint med ReactNode */
                description={isConverted ? <SeOverDescription /> : showCancelButton ? t("lasterOpp") : undefined}
                error={
                    validations?.length
                        ? t(`validation.${validations[0]}`)
                        : status === "FAILED"
                          ? t("uploadFailed")
                          : undefined
                }
            />
        </>
    );
};

export default FileUploadItem;
