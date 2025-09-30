import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import {
    getHentHendelserQueryKey,
    getHentHendelserBetaQueryKey,
} from "@generated/hendelse-controller/hendelse-controller";
import { getHentVedleggQueryKey } from "@generated/vedlegg-controller/vedlegg-controller";
import {
    GetDokumentasjonkravBetaQueryResult,
    getGetDokumentasjonkravBetaQueryKey,
    getGetOppgaverBetaQueryKey,
    GetOppgaverBetaQueryResult,
} from "@generated/oppgave-controller/oppgave-controller";
import { browserEnv } from "@config/env";

import { Metadata } from "../types";

const getQueryKeysForInvalidation = (fiksDigisosId: string): string[] =>
    [
        getHentVedleggQueryKey(fiksDigisosId),
        getHentHendelserQueryKey(fiksDigisosId),
        getHentHendelserBetaQueryKey(fiksDigisosId),
    ].flat();

const doFetch = async ({
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

const useSendVedleggHelper = (resetFilOpplastningData: () => void, metadata: Metadata) => {
    const queryClient = useQueryClient();
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const {
        mutate: mutate2,
        isPending: isPending2,
        isSuccess: isSuccess2,
        reset: reset2,
    } = useMutation({
        mutationFn: doFetch,
        onSuccess: async () => {
            resetFilOpplastningData();

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
                predicate: ({ queryKey }) => getQueryKeysForInvalidation(fiksDigisosId).includes(queryKey[0] as string),
            });
        },
    });
    const resetMutation2 = () => {
        reset2();
    };

    const upload2 = async (documentId: string) => {
        mutate2({ body: { metadata, fiksDigisosId, mellomlagring: false }, documentId });
    };

    return {
        upload: upload2,
        resetMutation: resetMutation2,
        errors: [],
        isPending: isPending2,
        isUploadSuccess: isSuccess2,
    };
};

export default useSendVedleggHelper;
