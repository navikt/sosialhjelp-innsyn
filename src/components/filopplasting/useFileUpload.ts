import { useMutation } from "@tanstack/react-query";
import { FileObject } from "@navikt/ds-react";
import { uploadFile } from "@components/filopplasting/utils/tusUploader";

export const useFileUpload = (uploadId: string, fiksDigisosId: string) =>
    useMutation({
        mutationFn: (files: FileObject[]) =>
            Promise.allSettled(files.map((file) => uploadFile({ id: uploadId, file, fiksDigisosId }))),
    });
