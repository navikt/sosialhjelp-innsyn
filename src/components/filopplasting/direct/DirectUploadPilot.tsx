"use client";

import { BodyLong, BodyShort, Button, FileObject, FileUpload, Heading, LocalAlert, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";
import { isFolder, validateFile } from "@components/filopplasting/utils/validateFiles";
import { useDirectUploadPilot } from "./useDirectUploadPilot";

export default function DirectUploadPilot({ fiksDigisosId }: { fiksDigisosId: string }) {
    const t = useTranslations("DirectUploadPilot");
    const { items, initialized, storageError, listingError, refresh, busy, stopped, start, check } =
        useDirectUploadPilot(fiksDigisosId);
    const [invalidFiles, setInvalidFiles] = useState<string[]>([]);

    const select = (files: FileObject[]) => {
        const valid = files.filter((item) => !item.error && !isFolder(item) && validateFile(item.file) === null);
        setInvalidFiles(files.filter((item) => !valid.includes(item)).map((item) => item.file.name));
        void start(valid.map((item) => item.file));
    };

    return (
        <VStack gap="space-24" paddingBlock="space-24">
            <Heading level="1" size="large">
                {t("title")}
            </Heading>
            <LocalAlert status="warning" role={undefined}>
                <LocalAlert.Header>
                    <LocalAlert.Title>{t("warningTitle")}</LocalAlert.Title>
                </LocalAlert.Header>
                <LocalAlert.Content>{t("warning")}</LocalAlert.Content>
            </LocalAlert>
            <BodyLong>{t("previewWarning")}</BodyLong>
            {storageError && <BodyLong role="alert">{t("storageError")}</BodyLong>}
            {listingError && (
                <Button variant="secondary" onClick={() => void refresh()}>
                    {t("check", { filename: t("files") })}
                </Button>
            )}
            <FileSelectUpload
                label={t("select")}
                headerId="direct-pilot-select"
                description={t("description")}
                buttonText={t("selectButton")}
                headingLevel="2"
                onSelect={select}
                currentCount={items.length}
                disabled={!initialized || storageError || busy}
            />
            {invalidFiles.length > 0 && (
                <BodyLong role="alert">{t("invalidFiles", { files: invalidFiles.join(", ") })}</BodyLong>
            )}
            {stopped && <BodyLong role="status">{t("stopped")}</BodyLong>}
            {items.length > 0 && (
                <VStack gap="space-12">
                    <Heading size="small" level="2">
                        {t("files")}
                    </Heading>
                    <VStack as="ul" gap="space-12">
                        {items.map((item) => (
                            <li key={item.operationId}>
                                <FileUpload.Item
                                    file={{ name: item.filename ?? item.operationId, size: item.size }}
                                    status={item.status === "UPLOADING" ? "uploading" : "idle"}
                                    description={t(`status.${item.status}`)}
                                />
                                <VStack gap="space-4" align="start">
                                    {item.converted && <BodyShort>{t("converted")}</BodyShort>}
                                    {(item.status === "UNKNOWN" || item.status === "MISSING") && (
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() => void check(item.operationId)}
                                        >
                                            {t("check", { filename: item.filename ?? item.operationId })}
                                        </Button>
                                    )}
                                </VStack>
                            </li>
                        ))}
                    </VStack>
                </VStack>
            )}
        </VStack>
    );
}
