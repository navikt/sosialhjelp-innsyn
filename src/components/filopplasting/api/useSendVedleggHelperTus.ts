import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
    GetDokumentasjonkravBetaQueryResult,
    getGetDokumentasjonkravBetaQueryKey,
    getGetOppgaverBetaQueryKey,
    GetOppgaverBetaQueryResult,
} from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import { SubmissionError, submitUpload } from "./submitUpload";

import { Metadata } from "../types";
import { getQueryKeysForInvalidation } from "./queryKeys";

const useSendVedleggHelperTus = (metadata: Required<Metadata>, onSuccess: () => void) => {
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
        { errors: SubmissionError[] } | Error,
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
            onSuccess();
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
