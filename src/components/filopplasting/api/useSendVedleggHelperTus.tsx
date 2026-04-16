import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
    getHentHendelserQueryKey,
    getHentHendelserBetaQueryKey,
} from "@generated/hendelse-controller/hendelse-controller";
import { getHentVedleggQueryKey } from "@generated/vedlegg-controller/vedlegg-controller";
import { browserEnv } from "@config/env";
import {
    GetDokumentasjonkravBetaQueryResult,
    getGetDokumentasjonkravBetaQueryKey,
    getGetOppgaverBetaQueryKey,
    getGetVedleggForOppgaveQueryKey,
    GetOppgaverBetaQueryResult,
} from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";

import { Metadata } from "../types";
import { getGetSaksDetaljerQueryKey } from "@generated/saks-oversikt-controller/saks-oversikt-controller";

const getQueryKeysForInvalidation = (fiksDigisosId: string, oppgaveId?: string): string[] =>
    [
        getHentVedleggQueryKey(fiksDigisosId),
        getHentHendelserQueryKey(fiksDigisosId),
        getHentHendelserBetaQueryKey(fiksDigisosId),
        getGetVedleggForOppgaveQueryKey(fiksDigisosId, oppgaveId),
        getGetSaksDetaljerQueryKey(fiksDigisosId),
    ].flat();

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

const useSendVedleggHelper = (metadata: Required<Metadata>) => {
    const queryClient = useQueryClient();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { mutate, isPending, isSuccess, reset, error } = useMutation<
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
    const resetMutation = () => {
        reset();
    };

    const upload = async (submissionId: string) => {
        mutate({ body: { metadata, fiksDigisosId }, submissionId }, { onError: () => {} });
    };

    return {
        upload,
        resetMutation,
        errors: [],
        isPending,
        isUploadSuccess: isSuccess,
        error,
    };
};

export default useSendVedleggHelper;
