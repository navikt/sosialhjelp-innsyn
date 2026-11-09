import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { browserEnv } from "@config/env";
import {
    DirectDocument,
    DirectUploadHttpError,
    createDraft,
    deleteUpload,
    getUpload,
    listUploads,
    uploadFile,
} from "./directUploadApi";

const sessionSchema = z.object({
    contextId: z.string().uuid(),
    reference: z
        .string()
        .regex(/^[A-Za-z0-9_-]{1,60}$/)
        .optional(),
    operations: z.array(z.string().uuid()).max(30),
    submissionId: z.string().uuid().optional(),
    submitting: z.boolean().optional(),
});
type PilotSession = z.infer<typeof sessionSchema>;
export type PilotItem = {
    operationId: string;
    filename?: string;
    size?: number;
    converted?: boolean;
    status: "UPLOADING" | "READY" | "UNKNOWN" | "MISSING" | "REJECTED";
};

export function useDirectUploadPilot(fiksDigisosId: string, contextKey = "pilot") {
    const key = `direct-upload-${contextKey}:${fiksDigisosId}`;
    const session = useRef<PilotSession | null>(null);
    const uploading = useRef(false);
    const [items, setItems] = useState<PilotItem[]>([]);
    const [initialized, setInitialized] = useState(false);
    const [storageError, setStorageError] = useState(false);
    const [busy, setBusy] = useState(false);
    const [stopped, setStopped] = useState(false);
    const [submissionId, setSubmissionId] = useState<string>();
    const [submitting, setSubmitting] = useState(false);
    const [listingError, setListingError] = useState(false);

    const save = useCallback(
        (value: PilotSession) => {
            sessionStorage.setItem(key, JSON.stringify(value));
            session.current = value;
        },
        [key]
    );

    const update = useCallback((item: PilotItem) => {
        setItems((previous) => {
            const existing = previous.find((entry) => entry.operationId === item.operationId);
            return existing
                ? previous.map((entry) => (entry.operationId === item.operationId ? { ...entry, ...item } : entry))
                : [...previous, item];
        });
    }, []);

    const applyDocument = useCallback(
        (document: DirectDocument) => {
            const current = session.current;
            if (!current || !current.operations.includes(document.operationId)) return;
            if (current.reference && current.reference !== document.navEksternRefId)
                throw new Error("Unexpected reference");
            if (current.submissionId && current.submissionId !== document.submissionId)
                throw new Error("Unexpected submission ID");
            save({ ...current, reference: document.navEksternRefId, submissionId: document.submissionId });
            setSubmissionId(document.submissionId);
            update(document);
        },
        [save, update]
    );

    const check = useCallback(
        async (operationId: string) => {
            try {
                applyDocument(await getUpload(operationId));
            } catch {
                update({ operationId, status: "UNKNOWN" });
            }
        },
        [applyDocument, update]
    );

    const checkSubmitted = useCallback(
        async (submissionId: string) => {
            const base = `${browserEnv.NEXT_PUBLIC_BASE_PATH}/api/upload-api/direct/submissions/${submissionId}`;
            const response = await fetch(`${base}/status?fiksDigisosId=${encodeURIComponent(fiksDigisosId)}`, {
                cache: "no-store",
            });
            if (!response.ok) throw new Error("Status unavailable");
            return (await response.json()).status === "SUBMITTED";
        },
        [fiksDigisosId]
    );

    useEffect(() => {
        let cancelled = false;
        const restore = async () => {
            await Promise.resolve();
            if (cancelled) return;
            try {
                const stored = sessionStorage.getItem(key);
                const value = stored
                    ? sessionSchema.parse(JSON.parse(stored))
                    : { contextId: crypto.randomUUID(), operations: [] };
                save(value);
                setSubmissionId(value.submissionId);
                setSubmitting(value.submitting ?? false);
                setItems(value.operations.map((operationId) => ({ operationId, status: "UNKNOWN" })));
                if (value.reference) {
                    if (value.submitting) {
                        setInitialized(true);
                        return;
                    }
                    const documents = await listUploads(value.reference).catch(() => {
                        if (!cancelled) setListingError(true);
                        return null;
                    });
                    if (!documents) return;
                    if (cancelled) return;
                    if (
                        !value.submitting &&
                        value.submissionId &&
                        documents.length === 0 &&
                        value.operations.length > 0
                    ) {
                        const submitted = await checkSubmitted(value.submissionId).catch(() => {
                            if (!cancelled) setListingError(true);
                            return null;
                        });
                        if (submitted === null || cancelled) return;
                        if (submitted) {
                            const fresh = { contextId: crypto.randomUUID(), operations: [] };
                            save(fresh);
                            setItems([]);
                            setSubmissionId(undefined);
                            setInitialized(true);
                            return;
                        }
                    }
                    if (
                        !value.submitting &&
                        value.operations.some((id) => !documents.some((document) => document.operationId === id))
                    ) {
                        setItems([
                            ...documents,
                            ...value.operations
                                .filter((id) => !documents.some((document) => document.operationId === id))
                                .map((operationId) => ({ operationId, status: "UNKNOWN" as const })),
                        ]);
                        setInitialized(true);
                        return;
                    }
                    if (!cancelled && !value.submitting) {
                        setItems(documents.map((document) => ({ ...document })));
                        save({ ...value, operations: documents.map((document) => document.operationId) });
                    }
                    if (value.submitting && value.submissionId) {
                        setSubmissionId(value.submissionId);
                    }
                } else if (value.submissionId) {
                    throw new Error("Missing draft reference");
                } else if (value.operations.length > 0) {
                    await Promise.all(value.operations.map(check));
                }
                if (!cancelled) {
                    if (!cancelled) setInitialized(true);
                }
            } catch {
                if (!cancelled) setStorageError(true);
            }
        };
        void restore();
        return () => {
            cancelled = true;
        };
    }, [applyDocument, check, checkSubmitted, key, save]);

    const start = async (files: File[]) => {
        if (!session.current || uploading.current || session.current.submitting) return;
        uploading.current = true;
        setBusy(true);
        setStopped(false);
        try {
            if (!session.current.reference) {
                try {
                    const draft = await createDraft(session.current.contextId, fiksDigisosId);
                    save({ ...session.current, reference: draft.navEksternRefId, submissionId: draft.submissionId });
                    setSubmissionId(draft.submissionId);
                } catch {
                    setStopped(true);
                    return;
                }
            }
            for (const [index, file] of files.entries()) {
                const current = session.current;
                if (!current || current.operations.length >= 30) {
                    setStopped(true);
                    break;
                }
                const operationId = crypto.randomUUID();
                try {
                    save({ ...current, operations: [...current.operations, operationId] });
                } catch {
                    setStorageError(true);
                    setStopped(true);
                    break;
                }
                update({ operationId, filename: file.name, size: file.size, status: "UPLOADING" });
                try {
                    const document = await uploadFile(file, operationId, current.contextId, fiksDigisosId);
                    applyDocument(document);
                    if (document.status !== "READY") {
                        setStopped(index < files.length - 1);
                        break;
                    }
                } catch (error) {
                    if (error instanceof DirectUploadHttpError && [400, 403, 413, 415, 422].includes(error.status)) {
                        update({ operationId, status: "REJECTED" });
                        try {
                            const latest = session.current;
                            if (latest)
                                save({ ...latest, operations: latest.operations.filter((id) => id !== operationId) });
                        } catch {
                            setStorageError(true);
                            setStopped(index < files.length - 1);
                            break;
                        }
                    } else {
                        update({ operationId, status: "UNKNOWN" });
                        setStopped(index < files.length - 1);
                        break;
                    }
                }
            }
        } finally {
            uploading.current = false;
            setBusy(false);
        }
    };

    const refresh = async () => {
        if (!session.current?.reference) return;
        try {
            const documents = await listUploads(session.current.reference);
            if (session.current.submissionId && session.current.operations.length > 0 && documents.length === 0) {
                if (await checkSubmitted(session.current.submissionId)) {
                    save({ contextId: crypto.randomUUID(), operations: [] });
                    setItems([]);
                    setSubmissionId(undefined);
                    setListingError(false);
                    setInitialized(true);
                    return;
                }
            }
            const missing = session.current.operations.filter(
                (id) => !documents.some((document) => document.operationId === id)
            );
            setItems([...documents, ...missing.map((operationId) => ({ operationId, status: "UNKNOWN" as const }))]);
            save({
                ...session.current,
                operations: [...documents.map((document) => document.operationId), ...missing],
            });
            setListingError(false);
            setInitialized(true);
        } catch {
            setListingError(true);
        }
    };

    const remove = async (operationId: string) => {
        if (!session.current || session.current.submitting) return;
        if (session.current.operations.includes(operationId)) await deleteUpload(operationId);
        save({ ...session.current, operations: session.current.operations.filter((id) => id !== operationId) });
        setItems((current) => current.filter((item) => item.operationId !== operationId));
    };

    const markSubmitting = () => {
        if (!session.current) throw new Error("Missing draft");
        save({ ...session.current, submitting: true });
        setSubmitting(true);
    };

    const verifyBeforeSubmit = async () => {
        const current = session.current;
        if (!current?.reference) throw new Error("Missing draft reference");
        const documents = await listUploads(current.reference).catch((error) => {
            setListingError(true);
            throw error;
        });
        if (
            documents.length !== current.operations.length ||
            current.operations.some((id) => !documents.some((document) => document.operationId === id))
        ) {
            setListingError(true);
            throw new Error("File list changed");
        }
    };

    const reset = () => {
        const fresh = { contextId: crypto.randomUUID(), operations: [] };
        save(fresh);
        setSubmissionId(undefined);
        setSubmitting(false);
        setItems([]);
    };

    return {
        items,
        initialized,
        storageError,
        busy,
        stopped,
        start,
        check,
        remove,
        submissionId,
        submitting,
        markSubmitting,
        verifyBeforeSubmit,
        listingError,
        refresh,
        reset,
    };
}
