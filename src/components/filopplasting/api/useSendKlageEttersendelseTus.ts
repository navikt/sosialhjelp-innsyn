import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Metadata } from "../types";
import { SubmissionError, submitUpload } from "./submitUpload";

const useSendKlageEttersendelseTus = (
    fiksDigisosId: string,
    klageId: string,
    onSuccess: () => void,
    onUploadSuccess: () => void
) => {
    const router = useRouter();

    const mutation = useMutation<void, { errors: SubmissionError[] } | Error, { submissionId: string }>({
        mutationFn: ({ submissionId }) =>
            submitUpload({
                submissionId,
                body: {
                    fiksDigisosId,
                    // TODO: Replace these values when the upload-api contract for klage ettersendelse is available.
                    metadata: {
                        dokumentKontekst: "ettersendelse",
                        type: "klage",
                        tilleggsinfo: "annet",
                        hendelsetype: "bruker",
                        hendelsereferanse: klageId,
                        innsendelsesfrist: "",
                    } satisfies Required<Metadata>,
                },
            }),
        throwOnError: false,
        onSuccess: () => {
            onSuccess();
            onUploadSuccess();
            router.refresh();
        },
    });

    return {
        upload: (submissionId: string) => mutation.mutate({ submissionId }),
        resetMutation: mutation.reset,
        isPending: mutation.isPending,
        isUploadSuccess: mutation.isSuccess,
        error: mutation.error,
    };
};

export default useSendKlageEttersendelseTus;
