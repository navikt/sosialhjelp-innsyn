import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { FileUpload } from "@navikt/ds-react/FileUpload";
import { BodyShort, Button, HStack, Loader } from "@navikt/ds-react";
import { InformationSquareFillIcon, TrashIcon, XMarkIcon } from "@navikt/aksel-icons";
import { UploadStatus, ValidationCode } from "@components/filopplasting/api/useDocumentState";

interface Props {
    originalFilename: string;
    convertedFilename?: string;
    validations?: ValidationCode[];
    url?: string;
    isConverted: boolean;
    status: UploadStatus;
    size?: number;
    showCancelButton?: boolean;
    onDelete: (button: HTMLButtonElement) => Promise<void>;
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
    validations,
    url,
    status,
    size,
    showCancelButton,
    onDelete,
    deleteDisabled,
    isConverted,
}: Props) => {
    const t = useTranslations("FileUploadItem");
    const { mutate, isPending } = useMutation({
        mutationFn: onDelete,
        retry: false,
    });

    // Ikke Aksel loading-prop: den setter disabled, og da mister knappen fokus.
    const isBusy = isPending;

    const isUploading = !url && !validations && status !== "FAILED" && status !== "COMPLETE" && !showCancelButton;
    const uploadStatus = isUploading ? "uploading" : "idle";
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
                            type="button"
                            icon={
                                isBusy ? (
                                    <Loader size="xsmall" />
                                ) : showCancelButton ? (
                                    <XMarkIcon aria-hidden />
                                ) : (
                                    <TrashIcon aria-hidden />
                                )
                            }
                            // Fast navn, slik at knappen ikke leses som Loader-teksten mens slettingen pågår.
                            aria-label={showCancelButton ? t("cancel") : t("slett")}
                            onClick={(e) => {
                                if (!isBusy) mutate(e.currentTarget);
                            }}
                            disabled={deleteDisabled}
                            aria-disabled={isBusy || deleteDisabled}
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
