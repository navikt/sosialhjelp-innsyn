import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { FileUpload } from "@navikt/ds-react/FileUpload";
import { Upload } from "tus-js-client";
import { BodyShort, Button, HStack, List } from "@navikt/ds-react";
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
}: Props) => {
    const t = useTranslations("FileUploadItem");
    const { mutate, isPending } = useMutation({
        mutationFn: () => Upload.terminate(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files/${uploadId}`, {}),
        retry: false,
    });
    const isConverted = !!convertedFilename && convertedFilename !== originalFilename;
    return (
        <>
            {/* @ts-expect-error Funker fint med ReactNode som children */}
            <FileUpload.Item
                file={{ name: convertedFilename ?? originalFilename, size }}
                as="li"
                status={
                    !url && !validations && status !== "FAILED" && status !== "COMPLETE" && !showCancelButton
                        ? "uploading"
                        : "idle"
                }
                button={
                    <Button
                        variant="tertiary"
                        data-color="neutral"
                        icon={<TrashIcon title={t("slett")} />}
                        onClick={() => mutate()}
                        loading={isPending}
                    />
                }
                onFileClick={url ? () => window.open(url, "_blank", "noopener,noreferrer") : undefined}
                description={isConverted ? <SeOverDescription /> : undefined}
                error={
                    validations?.length ? (
                        <List>
                            {validations.map((val) => (
                                <List.Item key={val} className="text-ax-text-warning-subtle">
                                    {t(`validation.${val}`)}
                                </List.Item>
                            ))}
                        </List>
                    ) : status === "FAILED" ? (
                        t("uploadFailed")
                    ) : undefined
                }
            />
        </>
    );
};

export default FileUploadItem;
