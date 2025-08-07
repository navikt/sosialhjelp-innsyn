import { logger } from "@navikt/next-logger";
import { useQueryClient } from "@tanstack/react-query";

import {
    getHentHendelserQueryKey,
    getHentHendelserBetaQueryKey,
} from "@generated/hendelse-controller/hendelse-controller";
import { useSendVedlegg, getHentVedleggQueryKey } from "@generated/vedlegg-controller/vedlegg-controller";

import {
    FancyFile,
    Feil,
    Error,
    createMetadataFile,
    formatFilesForUpload,
    determineErrorType,
    Metadata,
} from "./useFilOpplastingApp";

const useSendVedleggHelper = (fiksDigisosId: string, setOuterErrors: (errors: Error[]) => void, reset: () => void) => {
    const { isPending, mutate } = useSendVedlegg();
    const queryClient = useQueryClient();

    const upload = (files: FancyFile[], metadata: Metadata) => {
        if (files.length === 0) {
            setOuterErrors([{ feil: Feil.NO_FILES }]);
            return;
        }

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
                    setOuterErrors(errors);

                    if (errors.length === 0) {
                        reset();

                        await queryClient.invalidateQueries({ queryKey: getHentVedleggQueryKey(fiksDigisosId) });
                        await queryClient.invalidateQueries({ queryKey: getHentHendelserQueryKey(fiksDigisosId) });
                        await queryClient.invalidateQueries({ queryKey: getHentHendelserBetaQueryKey(fiksDigisosId) });
                    }
                },
                onError: (error) => {
                    logger.warn("Feil med opplasting av vedlegg: " + error.message);
                    if (error.message === "Mulig virus funnet") {
                        setOuterErrors([{ feil: Feil.VIRUS }]);
                    } else {
                        setOuterErrors([{ feil: Feil.KLIENTFEIL }]);
                    }
                },
            }
        );
    };

    return { isPending, upload };
};

export default useSendVedleggHelper;
