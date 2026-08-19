import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { FileUpload } from "@navikt/ds-react/FileUpload";
import { Upload } from "tus-js-client";
import { BodyShort, Button, HStack } from "@navikt/ds-react";
import { InformationSquareFillIcon, TrashIcon } from "@navikt/aksel-icons";
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
    // Kalles synkront FØR mutate() starter, altså før React rekker å re-rendre
    // knappen med disabled=true (Aksel sin <Button> setter faktisk disabled-
    // attributtet når loading=true, se Button.js). Uten dette mister nettleseren
    // fokus til <body> med en gang du klikker slett — lenge før DELETING-status
    // eller live-region-kunngjøringen i det hele tatt rekker å kjøre.
    onBeforeDelete?: () => void;
    buttonRef?: (el: HTMLButtonElement | null) => void;
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
    onBeforeDelete,
    buttonRef,
    deleteDisabled,
}: Props) => {
    const t = useTranslations("FileUploadItem");
    const { mutate, isPending } = useMutation({
        mutationFn: () => Upload.terminate(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files/${uploadId}`, {}),
        onSuccess: () => onTerminate?.(),
        retry: false,
    });
    const isConverted = !!convertedFilename && convertedFilename !== originalFilename;

    // Status DELETING betyr at filen er merket for sletting men fortsatt i DOM —
    // den vises som "uploading" (spinner) slik at brukeren ser at noe skjer,
    // og slett-knappen disables for å hindre dobbelklikk.
    const isDeleting = status === "DELETING";
    const isUploading =
        (!url && !validations && status !== "FAILED" && status !== "COMPLETE" && !showCancelButton) || isDeleting;
    const uploadStatus = isUploading ? "uploading" : "idle";

    return (
        <>
            <FileUpload.Item
                file={{ name: convertedFilename ?? originalFilename, size }}
                as="li"
                status={uploadStatus}
                button={
                    <Button
                        ref={buttonRef}
                        variant="tertiary"
                        data-color="neutral"
                        icon={<TrashIcon title={t("slett")} />}
                        onClick={() => {
                            // Må skje synkront, FØR mutate() setter isPending/loading
                            // på denne knappen — ellers rekker vi ikke å flytte fokus
                            // bort før nettleseren tvinger det til <body>.
                            onBeforeDelete?.();
                            mutate();
                        }}
                        disabled={deleteDisabled || isDeleting}
                        loading={isPending}
                    />
                }
                onFileClick={url ? () => window.open(url, "_blank", "noopener,noreferrer") : undefined}
                /* @ts-expect-error Funker fint med ReactNode */
                description={isConverted ? <SeOverDescription /> : undefined}
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
