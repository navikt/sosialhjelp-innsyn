"use client";

import { BodyLong, Button, FileObject, FileUpload, Heading, VStack } from "@navikt/ds-react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { browserEnv } from "@config/env";
import { Props } from "@components/filopplasting/OpplastingsboksTus";
import { FileSelectUpload } from "@components/filopplasting/FileSelectUpload";
import { isFolder, validateFile } from "@components/filopplasting/utils/validateFiles";
import { getQueryKeysForInvalidation } from "@components/filopplasting/api/queryKeys";
import { useDirectUploadPilot } from "./useDirectUploadPilot";

export default function DirectUploadBox({ metadata, label, description, tag, uploadContextId }: Props) {
    const t = useTranslations("DirectUploadBox");
    const existing = useTranslations("Opplastingsboks");
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const draft = useDirectUploadPilot(id, uploadContextId);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [sending, setSending] = useState(false);
    const sendingRef = useRef(false);
    const [deleting, setDeleting] = useState(false);

    const select = (files: FileObject[]) => {
        if (sendingRef.current) return;
        if (draft.items.some((item) => item.status === "UNKNOWN")) return;
        setSuccess(false);
        const valid = files.filter((item) => !item.error && !isFolder(item) && validateFile(item.file) === null);
        setError(valid.length !== files.length);
        void draft.start(valid.map((item) => item.file));
    };

    const remove = async (operationId: string) => {
        if (sendingRef.current || deleting || draft.busy) return;
        setDeleting(true);
        try {
            await draft.remove(operationId);
        } catch {
            setError(true);
        } finally {
            setDeleting(false);
        }
    };

    const send = async (checkOnly: boolean) => {
        if (!draft.submissionId || sendingRef.current || deleting || draft.busy) return;
        sendingRef.current = true;
        setSending(true);
        setError(false);
        let accepted = false;
        try {
            if (!checkOnly) await draft.verifyBeforeSubmit();
            if (!checkOnly) draft.markSubmitting();
            const base = `${browserEnv.NEXT_PUBLIC_BASE_PATH}/api/upload-api/direct/submissions/${draft.submissionId}`;
            const url = checkOnly ? `${base}/status?fiksDigisosId=${encodeURIComponent(id)}` : `${base}/submit`;
            const response = await fetch(
                url,
                checkOnly
                    ? { cache: "no-store" }
                    : {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                              fiksDigisosId: id,
                              operationIds: draft.items.map((item) => item.operationId),
                              metadata: {
                                  type: metadata.type,
                                  tilleggsinfo: metadata.tilleggsinfo ?? "annet",
                                  innsendelsesfrist: "",
                                  hendelsetype: metadata.hendelsetype ?? "bruker",
                                  hendelsereferanse: metadata.hendelsereferanse ?? "",
                              },
                          }),
                      }
            );
            if (!response.ok) throw new Error("Submission failed");
            const result: { status: string } = await response.json();
            if (result.status !== "SUBMITTED") throw new Error("Submission outcome unknown");
            accepted = true;
            draft.reset();
            setSuccess(true);
            await queryClient.invalidateQueries({
                predicate: ({ queryKey }) =>
                    getQueryKeysForInvalidation(id, metadata.hendelsereferanse).includes(queryKey[0] as string),
            });
        } catch {
            if (accepted) setSuccess(true);
            else setError(true);
        } finally {
            sendingRef.current = false;
            setSending(false);
        }
    };

    return (
        <VStack gap="space-16">
            <FileSelectUpload
                label={label ?? existing("tittel")}
                description={description ?? existing("beskrivelse")}
                tag={tag}
                headerId={`direct-${uploadContextId.replace(/[^A-Za-z0-9_-]/g, "-")}`}
                buttonText={existing("lastOppFiler")}
                currentCount={draft.items.length}
                disabled={
                    !draft.initialized ||
                    sending ||
                    draft.busy ||
                    draft.submitting ||
                    draft.storageError ||
                    draft.listingError ||
                    deleting ||
                    draft.items.some((item) => item.status === "UNKNOWN")
                }
                onSelect={select}
            />
            {draft.storageError && <BodyLong role="alert">{t("storageError")}</BodyLong>}
            {draft.listingError && (
                <VStack gap="space-8">
                    <BodyLong role="alert">{t("listingError")}</BodyLong>
                    <Button variant="secondary" onClick={() => void draft.refresh()}>
                        {t("check")}
                    </Button>
                </VStack>
            )}
            {draft.stopped && <BodyLong role="status">{t("stopped")}</BodyLong>}
            {error && <BodyLong role="alert">{draft.submitting ? t("uncertain") : t("error")}</BodyLong>}
            {success && <BodyLong role="status">{existing("suksess")}</BodyLong>}
            {draft.items.length > 0 && (
                <VStack gap="space-8">
                    <Heading size="xsmall" level="3">
                        {t("files")}
                    </Heading>
                    <VStack as="ul" gap="space-12">
                        {draft.items.map((item) => (
                            <li key={item.operationId}>
                                <FileUpload.Item
                                    file={{ name: item.filename ?? item.operationId, size: item.size }}
                                    status={item.status === "UPLOADING" ? "uploading" : "idle"}
                                    description={t(`status.${item.status}`)}
                                />
                                <VStack gap="space-4" align="start">
                                    {(item.status === "READY" ||
                                        item.status === "MISSING" ||
                                        item.status === "REJECTED") &&
                                        !draft.submitting && (
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                disabled={deleting || sending}
                                                onClick={() => void remove(item.operationId)}
                                            >
                                                {t("delete", { filename: item.filename ?? item.operationId })}
                                            </Button>
                                        )}
                                    {item.status === "UNKNOWN" && (
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() => void draft.check(item.operationId)}
                                        >
                                            {t("check")}
                                        </Button>
                                    )}
                                </VStack>
                            </li>
                        ))}
                    </VStack>
                    {draft.submitting ? (
                        <Button variant="secondary" loading={sending} onClick={() => void send(true)}>
                            {t("checkSubmission")}
                        </Button>
                    ) : (
                        <Button
                            loading={sending}
                            disabled={
                                deleting ||
                                draft.listingError ||
                                draft.busy ||
                                !draft.items.every((item) => item.status === "READY") ||
                                !draft.submissionId
                            }
                            onClick={() => void send(false)}
                        >
                            {existing("sendInn")}
                        </Button>
                    )}
                </VStack>
            )}
            {draft.items.length > 0 && !draft.submitting && (
                <Button
                    variant="secondary"
                    loading={deleting}
                    disabled={sending || draft.busy || draft.items.some((item) => item.status === "UNKNOWN")}
                    onClick={() => {
                        setDeleting(true);
                        void (async () => {
                            try {
                                for (const item of draft.items) await draft.remove(item.operationId);
                                draft.reset();
                            } catch {
                                setError(true);
                            } finally {
                                setDeleting(false);
                            }
                        })();
                    }}
                >
                    {t("discard")}
                </Button>
            )}
        </VStack>
    );
}
