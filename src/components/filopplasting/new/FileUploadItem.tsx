import dynamic from "next/dynamic";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { Upload } from "tus-js-client";
import { BodyShort, Button, HStack, Link, List, Loader, VStack } from "@navikt/ds-react";
import cx from "classnames";
import { ExclamationmarkTriangleFillIcon, FilePdfIcon, TrashIcon } from "@navikt/aksel-icons";
import { browserEnv } from "@config/env";
import { ValidationCode } from "@components/filopplasting/new/api/useDocumentState";

interface Props {
    originalFilename: string;
    convertedFilename?: string;
    uploadId: string;
    validations?: ValidationCode[];
    url?: string;
}

const FilePreviewModal = dynamic(() => import("./preview/FilePreviewModal"), { ssr: false });

const FileUploadItem = ({ convertedFilename, originalFilename, uploadId, validations, url }: Props) => {
    const ref = useRef<HTMLDialogElement>(null);
    const t = useTranslations("FileUploadItem");
    const { mutate, isPending } = useMutation({
        mutationFn: () => Upload.terminate(`${browserEnv.NEXT_PUBLIC_TUSD_URL}/${uploadId}`),
        retry: false,
    });
    // Filen er ikke ferdigbehandlet på backend enda
    if (!url) {
        return (
            <HStack as="li" justify="space-between" className={cx("border rounded-2xl p-6")}>
                <VStack justify="center">
                    <HStack gap="4" align="center" wrap={false}>
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
                    "border-ax-border-warning-subtle": convertedFilename,
                    "border-ax-border-danger": validations?.length,
                })}
            >
                <VStack justify="center">
                    <HStack gap="4" align="center" wrap={false}>
                        <FilePdfIcon height="32px" width="32px" />
                        <Link onClick={() => ref.current?.showModal()} className="overflow-ellipsis">
                            {originalFilename}
                        </Link>
                    </HStack>
                    {convertedFilename && (
                        <HStack align="center" gap="2" className="text-ax-text-warning-subtle">
                            <ExclamationmarkTriangleFillIcon aria-hidden />
                            <BodyShort>{t("seOver")}</BodyShort>
                        </HStack>
                    )}
                    {validations?.length && (
                        <List>
                            {validations.map((val) => (
                                <List.Item key={val} className="text-ax-text-warning-subtle">
                                    {t(`validation.${val}`)}
                                </List.Item>
                            ))}
                        </List>
                    )}
                </VStack>
                <Button
                    icon={<TrashIcon height="32px" width="32px" />}
                    size="small"
                    loading={isPending}
                    variant="tertiary-neutral"
                    onClick={() => mutate()}
                />
            </HStack>
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
