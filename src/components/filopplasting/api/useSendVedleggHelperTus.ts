import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
    GetDokumentasjonkravBetaQueryResult,
    getGetDokumentasjonkravBetaQueryKey,
    getGetOppgaverBetaQueryKey,
    GetOppgaverBetaQueryResult,
} from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import { browserEnv } from "@config/env";

import { Metadata } from "../types";
import { getQueryKeysForInvalidation } from "./queryKeys";

const submitUpload = async ({
    submissionId,
    body,
}: {
    body: { fiksDigisosId: string; metadata: Metadata };
    submissionId: string;
}) =>
    fetch(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/submission/${submissionId}/submit`, {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    }).then(async (res) => {
        if (!res.ok) {
            if (res.status === 422) {
                throw await res.json();
            }
            throw new Error(`Feil ved opplasting av vedlegg: ${res.status} ${res.statusText}`);
        }
    });

export const SubmissionError = ["TOO_MANY_FILES", "TOTAL_SIZE_TOO_LARGE"] as const;

const useSendVedleggHelperTus = (metadata: Required<Metadata>) => {
    const queryClient = useQueryClient();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const {
        mutate,
        isPending,
        isSuccess,
        reset: resetMutation,
        error,
    } = useMutation<
        void,
        { errors: (typeof SubmissionError)[] } | Error,
        {
            body: {
                fiksDigisosId: string;
                metadata: Metadata;
            };
            submissionId: string;
        }
    >({
        mutationFn: submitUpload,
        throwOnError: false,
        onSuccess: async () => {
            // Setter manuelt for å ikke flytte på rekkefølgen i oppgavelisten
            queryClient.setQueryData<GetOppgaverBetaQueryResult>(getGetOppgaverBetaQueryKey(fiksDigisosId), (prev) => {
                return prev?.map((oppgave) => {
                    if (
                        oppgave.hendelsereferanse === metadata.hendelsereferanse &&
                        oppgave.dokumenttype === metadata.type &&
                        oppgave.tilleggsinformasjon === metadata.tilleggsinfo
                    ) {
                        return {
                            ...oppgave,
                            erLastetOpp: true,
                            opplastetDato: new Date().toISOString(),
                        };
                    }
                    return oppgave;
                });
            });
            queryClient.setQueryData<GetDokumentasjonkravBetaQueryResult>(
                getGetDokumentasjonkravBetaQueryKey(fiksDigisosId),
                (prev) => {
                    return prev?.map((dokumentasjonkrav) => {
                        if (dokumentasjonkrav.dokumentasjonkravReferanse === metadata.hendelsereferanse) {
                            return {
                                ...dokumentasjonkrav,
                                erLastetOpp: true,
                                opplastetDato: new Date().toISOString(),
                            };
                        }
                        return dokumentasjonkrav;
                    });
                }
            );

            await queryClient.invalidateQueries({
                predicate: ({ queryKey }) =>
                    getQueryKeysForInvalidation(fiksDigisosId, metadata.hendelsereferanse).includes(
                        queryKey[0] as string
                    ),
            });
        },
    });

    const upload = (submissionId: string) => {
        mutate({ body: { metadata, fiksDigisosId }, submissionId });
    };

    return {
        upload,
        resetMutation,
        isPending,
        isUploadSuccess: isSuccess,
        error,
    };
};

export default useSendVedleggHelperTus;
