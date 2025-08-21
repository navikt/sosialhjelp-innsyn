import { logger } from "@navikt/next-logger";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
    getHentHendelserQueryKey,
    getHentHendelserBetaQueryKey,
} from "@generated/hendelse-controller/hendelse-controller";
import { useSendVedlegg, getHentVedleggQueryKey } from "@generated/vedlegg-controller/vedlegg-controller";
import {
    GetDokumentasjonkravBetaQueryResult,
    getGetDokumentasjonkravBetaQueryKey,
    getGetOppgaverBetaQueryKey,
    GetOppgaverBetaQueryResult,
} from "@generated/oppgave-controller/oppgave-controller";

import { FancyFile, Error, Metadata, Feil } from "../types";
import { determineErrorType } from "../utils/mapErrors";
import { createMetadataFile, formatFilesForUpload } from "../utils/formatFiles";

const getQueryKeysForInvalidation = (fiksDigisosId: string): string[] =>
    [
        getHentVedleggQueryKey(fiksDigisosId),
        getHentHendelserQueryKey(fiksDigisosId),
        getHentHendelserBetaQueryKey(fiksDigisosId),
    ].flat();

const useSendVedleggHelper = (fiksDigisosId: string, resetFilOpplastningData: () => void) => {
    const { isPending, mutate, isSuccess, reset } = useSendVedlegg();
    const queryClient = useQueryClient();
    const [errors, setErrors] = useState<Error[]>([]);
    const isUploadSuccess = isSuccess && errors.length === 0;

    const resetMutation = () => {
        reset();
        setErrors([]);
    };

    const upload = (files: FancyFile[], metadata: Metadata) => {
        mutate(
            {
                fiksDigisosId,
                data: {
                    files: [createMetadataFile(files, metadata), ...formatFilesForUpload(files)],
                },
            },
            {
                onSuccess: async (data) => {
                    const filerData = data.flatMap((response) => response.filer);
                    const errors: Error[] = filerData
                        .filter((it) => it.status !== "OK")
                        .map((it) => ({ feil: determineErrorType(it.status)!, filnavn: it.filnavn }));
                    setErrors(errors);

                    if (errors.length === 0) {
                        resetFilOpplastningData();

                        // Setter manuelt for å ikke flytte på rekkefølgen i oppgavelisten
                        queryClient.setQueryData<GetOppgaverBetaQueryResult>(
                            getGetOppgaverBetaQueryKey(fiksDigisosId),
                            (prev) => {
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
                            }
                        );
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
                                getQueryKeysForInvalidation(fiksDigisosId).includes(queryKey[0] as string),
                        });
                    }
                },
                onError: (error) => {
                    logger.warn("Feil med opplasting av vedlegg: " + error.message);
                    if (error.message === "Mulig virus funnet") {
                        setErrors([{ feil: Feil.VIRUS }]);
                    } else {
                        setErrors([{ feil: Feil.KLIENTFEIL }]);
                    }
                },
            }
        );
    };

    return { upload, resetMutation, errors, isPending, isUploadSuccess };
};

export default useSendVedleggHelper;
