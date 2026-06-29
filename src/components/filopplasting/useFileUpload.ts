import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileObject } from "@navikt/ds-react";
import { uploadFile } from "@components/filopplasting/utils/tusUploader";

export const UPLOAD_MUTATION_KEY = ["fileUpload"] as const;

export const useFileUpload = (uploadId: string, fiksDigisosId: string) => {
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationKey: UPLOAD_MUTATION_KEY,
        mutationFn: (file: FileObject) => uploadFile({ id: uploadId, file, fiksDigisosId }),
    });

    const startUpload = (file: FileObject) => mutate(file);

    const dismiss = (mutationId: number) => {
        const cache = queryClient.getMutationCache();
        const target = cache.getAll().find((m) => m.mutationId === mutationId);
        if (target) cache.remove(target);
    };

    return { startUpload, dismiss };
};
