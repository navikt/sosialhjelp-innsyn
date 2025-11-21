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

const getQueryKeysForInvalidation = (fiksDigisosId: string, oppgaveId?: string): string[] =>
    [
        getHentVedleggQueryKey(fiksDigisosId),
        getHentHendelserQueryKey(fiksDigisosId),
        getHentHendelserBetaQueryKey(fiksDigisosId),
        getGetVedleggForOppgaveQueryKey(fiksDigisosId, oppgaveId),
    ].flat();

const submitUpload = async ({
    documentId,
    body,
}: {
    body: { fiksDigisosId: string; metadata: Metadata; mellomlagring: false };
    documentId: string;
}) =>
    fetch(`${browserEnv.NEXT_PUBLIC_UPLOAD_API_BASE}/document/${documentId}/submit`, {
        method: "post",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
    }).then((res) => {
        if (!res.ok) {
            throw new Error(`Feil ved opplasting av vedlegg: ${res.status} ${res.statusText}`);
        }
    });

const useSendVedleggHelper = (metadata: Metadata) => {
    const queryClient = useQueryClient();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { mutate, isPending, isSuccess, reset, error } = useMutation({
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

    const upload = async (documentId: string) => {
        mutate({ body: { metadata, fiksDigisosId, mellomlagring: false }, documentId });
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
