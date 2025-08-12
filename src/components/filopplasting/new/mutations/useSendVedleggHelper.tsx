import { logger } from "@navikt/next-logger";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
    getHentHendelserQueryKey,
    getHentHendelserBetaQueryKey,
} from "@generated/hendelse-controller/hendelse-controller";
import { useSendVedlegg, getHentVedleggQueryKey } from "@generated/vedlegg-controller/vedlegg-controller";

import { FancyFile, Error, Metadata, Feil } from "../types";
import { determineErrorType } from "../utils/mapErrors";
import { createMetadataFile, formatFilesForUpload } from "../utils/formatFiles";

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

                        await queryClient.invalidateQueries({ queryKey: getHentVedleggQueryKey(fiksDigisosId) });
                        await queryClient.invalidateQueries({ queryKey: getHentHendelserQueryKey(fiksDigisosId) });
                        await queryClient.invalidateQueries({ queryKey: getHentHendelserBetaQueryKey(fiksDigisosId) });
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
