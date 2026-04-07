import dynamic from "next/dynamic";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { FileUpload } from "@navikt/ds-react/FileUpload";
import { Upload } from "tus-js-client";
import { BodyShort, HStack, List } from "@navikt/ds-react";
import { ExclamationmarkTriangleFillIcon } from "@navikt/aksel-icons";
import { browserEnv } from "@config/env";
import { UploadStatus, ValidationCode } from "@components/filopplasting/api/useDocumentState";

interface Props {
    originalFilename: string;
    convertedFilename?: string;
    uploadId: string;
    validations?: ValidationCode[];
    url?: string;
    status: UploadStatus;
}

const FilePreviewModal = dynamic(() => import("./preview/FilePreviewModal"), { ssr: false });

const SeOverDescription = () => {
    const t = useTranslations("FileUploadItem");
    return (
        <HStack align="center" gap="space-8" className="text-ax-text-warning-subtle">
            <ExclamationmarkTriangleFillIcon aria-hidden />
            <BodyShort>{t("seOver")}</BodyShort>
        </HStack>
    );
};

const FileUploadItem = ({ convertedFilename, originalFilename, uploadId, validations, url, status }: Props) => {
    const ref = useRef<HTMLDialogElement>(null);
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
                className={isConverted ? "border-ax-border-warning-subtle! border rounded-xl *:border-none" : undefined}
                file={{ name: convertedFilename ?? originalFilename }}
                as="li"
                status={
                    (!url && !validations && status !== "FAILED" && status !== "COMPLETE") || isPending
                        ? "uploading"
                        : "idle"
                }
                button={{ action: "delete", onClick: () => mutate() }}
                onFileClick={() => ref.current?.showModal()}
                description={convertedFilename ? <SeOverDescription /> : undefined}
                error={
                    status === "FAILED" ? (
                        "Det skjedde noe galt. Prøv å last oppfilen på nytt"
                    ) : validations?.length ? (
                        <List>
                            {validations.map((val) => (
                                <List.Item key={val} className="text-ax-text-warning-subtle">
                                    {t(`validation.${val}`)}
                                </List.Item>
                            ))}
                        </List>
                    ) : undefined
                }
            />
            {url && (
                <FilePreviewModal
                    ref={ref}
                    onClose={() => ref.current?.close()}
                    filename={originalFilename}
                    url={url}
                    isPdf={!!convertedFilename || originalFilename.endsWith(".pdf")}
                />
            )}
        </>
    );
};

export default FileUploadItem;
