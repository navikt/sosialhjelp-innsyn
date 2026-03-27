import dynamic from "next/dynamic";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { Upload } from "tus-js-client";
import { BodyShort, Button, HStack, InfoCard, Link, List, Loader, VStack } from "@navikt/ds-react";
import cx from "classnames";
import { ExclamationmarkTriangleFillIcon, FilePdfIcon, TrashIcon } from "@navikt/aksel-icons";
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

const FileUploadItem = ({ convertedFilename, originalFilename, uploadId, validations, url, status }: Props) => {
    const ref = useRef<HTMLDialogElement>(null);
    const t = useTranslations("FileUploadItem");
    const { mutate, isPending } = useMutation({
        mutationFn: () => Upload.terminate(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/tus/files/${uploadId}`, {}),
        retry: false,
    });
    const isConverted = !!convertedFilename && convertedFilename !== originalFilename;
    // Filen er ikke ferdigbehandlet på backend enda
    if (!url && !validations && status !== "FAILED" && status !== "COMPLETE") {
        return (
            <HStack as="li" justify="space-between" className={cx("border rounded-2xl p-6")}>
                <VStack justify="center">
                    <HStack gap="space-16" align="center" wrap={false}>
                        <Loader />
                        <Link className="overflow-ellipsis">{originalFilename}</Link>
                    </HStack>
                </VStack>
            </HStack>
        );
    }
    return (
        <>
            <HStack
                as="li"
                justify="space-between"
                className={cx("border rounded-2xl p-6", {
                    "border-ax-border-warning-subtle": isConverted,
                    "border-ax-border-danger": validations?.length,
                })}
            >
                <VStack justify="center">
                    <HStack gap="space-16" align="center" wrap={false}>
                        <FilePdfIcon height="32px" width="32px" />
                        {url ? (
                            <Link onClick={() => ref.current?.showModal()} className="overflow-ellipsis">
                                {originalFilename}
                            </Link>
                        ) : (
                            <BodyShort weight="semibold" className="overflow-ellipsis">
                                {originalFilename}
                            </BodyShort>
                        )}
                    </HStack>
                    {isConverted && (
                        <HStack align="center" gap="space-8" className="text-ax-text-warning-subtle">
                            <ExclamationmarkTriangleFillIcon aria-hidden />
                            <BodyShort>{t("seOver")}</BodyShort>
                        </HStack>
                    )}
                    {validations?.length && (
                        <List>
                            {validations.map((val) => (
                                <List.Item key={val} className="text-ax-text-danger-subtle">
                                    {t(`validation.${val}`)}
                                </List.Item>
                            ))}
                        </List>
                    )}
                    {status === "FAILED" && (
                        <InfoCard data-color="danger">
                            <InfoCard.Header icon={<ExclamationmarkTriangleFillIcon aria-hidden />}>
                                <InfoCard.Title as="h3">
                                    Det skjedde noe galt. Prøv å last opp filen på nytt
                                </InfoCard.Title>
                            </InfoCard.Header>
                        </InfoCard>
                    )}
                </VStack>
                <Button
                    icon={<TrashIcon height="32px" width="32px" />}
                    size="small"
                    loading={isPending}
                    variant="tertiary-neutral"
                    onClick={() => mutate()}
                    aria-label={t("slett")}
                />
            </HStack>
            {url && (
                <FilePreviewModal
                    ref={ref}
                    onClose={() => ref.current?.close()}
                    filename={originalFilename}
                    url={url}
                    isPdf={isConverted || originalFilename.endsWith(".pdf")}
                />
            )}
        </>
    );
};

export default FileUploadItem;
