import path from "path";

import { useCallback, useEffect, useMemo, useState } from "react";
import { UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import { logger } from "@navikt/next-logger";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";

import {
    logAmplitudeEvent,
    logBrukerLeavingBeforeSubmitting,
    logDuplicatedFiles,
    logFileUploadFailedEvent,
} from "../../utils/amplitude";
import { SendVedleggBody, VedleggOpplastingResponseStatus } from "../../generated/model";
import { containsIllegalCharacters, maxCombinedFileSize, maxFileSize } from "../../utils/vedleggUtils";
import {
    getHentVedleggQueryKey,
    sendVedlegg,
    useSendVedlegg,
} from "../../generated/vedlegg-controller/vedlegg-controller";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import { getHentHendelserQueryKey } from "../../generated/hendelse-controller/hendelse-controller";

import { useFilUploadSuccessful } from "./FilUploadSuccessfulContext";

export interface FancyFile {
    file: File;
    uuid: string;
}

export interface Metadata {
    type: string;
    tilleggsinfo?: string;
    innsendelsesfrist?: string;
    hendelsetype?: string;
    hendelsereferanse?: string;
}

export interface Error {
    feil: Feil;
}

export interface ErrorWithFile extends Error {
    fil: File;
    filnavn: string;
}

export enum Feil {
    FILE_TOO_LARGE,
    ILLEGAL_FILE_TYPE,
    PDF_ENCRYPTED,
    PDF_SIGNED,
    ILLEGAL_FILE_NAME,
    KLIENTFEIL,
    COULD_NOT_LOAD_DOCUMENT,
    VIRUS,
    COMBINED_TOO_LARGE,
    NO_FILES,
    TOO_MANY_FILES,
}

export const errorStatusToMessage: Record<Feil, string> = {
    [Feil.COMBINED_TOO_LARGE]: "vedlegg.opplasting_feilmelding_COMBINED_FILES_TOO_LARGE",
    [Feil.NO_FILES]: "vedlegg.minst_ett_vedlegg",
    [Feil.COULD_NOT_LOAD_DOCUMENT]: "vedlegg.opplasting_feilmelding_COULD_NOT_LOAD_DOCUMENT",
    [Feil.FILE_TOO_LARGE]: "vedlegg.opplasting_feilmelding_FILE_TOO_LARGE",
    [Feil.ILLEGAL_FILE_TYPE]: "vedlegg.opplasting_feilmelding_ILLEGAL_FILE_TYPE",
    [Feil.PDF_ENCRYPTED]: "vedlegg.opplasting_feilmelding_PDF_IS_ENCRYPTED",
    [Feil.PDF_SIGNED]: "vedlegg.opplasting_feilmelding_PDF_IS_SIGNED",
    [Feil.ILLEGAL_FILE_NAME]: "vedlegg.opplasting_feilmelding_ILLEGAL_FILENAME",
    [Feil.KLIENTFEIL]: "vedlegg.opplasting_backend_feilmelding",
    [Feil.VIRUS]: "vedlegg.opplasting_backend_virus_feilmelding",
    [Feil.TOO_MANY_FILES]: "vedlegg.opplasting_feilmelding_TOO_MANY_FILES",
};

function determineErrorType(status: VedleggOpplastingResponseStatus): Feil | undefined {
    switch (status) {
        case "ILLEGAL_FILE_TYPE":
            return Feil.ILLEGAL_FILE_TYPE;
        case "COULD_NOT_LOAD_DOCUMENT":
            return Feil.KLIENTFEIL;
        case "PDF_IS_ENCRYPTED":
            return Feil.PDF_ENCRYPTED;
        case "FILE_TOO_LARGE":
            return Feil.FILE_TOO_LARGE;
        case "ILLEGAL_FILENAME":
            return Feil.ILLEGAL_FILE_NAME;
    }
}

const recordFromMetadatas = (metadatas: Metadata[]) =>
    metadatas.reduce((acc, curr, currentIndex) => ({ ...acc, [currentIndex]: [] }), {});

const isSpraakChanging = (url: string, fiksDigisosId: string) => {
    return (
        (url.startsWith("/sosialhjelp/innsyn/") && url.includes(fiksDigisosId)) ||
        (url.startsWith("/sosialhjelp/innsyn/nn") && url.includes(fiksDigisosId)) ||
        (url.startsWith("/sosialhjelp/innsyn/en") && url.includes(fiksDigisosId))
    );
};

const useFilOpplasting = (
    metadatas: Metadata[],
    options?: UseMutationOptions<
        Awaited<ReturnType<typeof sendVedlegg>>,
        unknown,
        { fiksDigisosId: string; data: SendVedleggBody }
    >
) => {
    const t = useTranslations("common");
    const queryClient = useQueryClient();
    const fiksDigisosId = useFiksDigisosId();
    const { isPending, mutate, error, isError, data } = useSendVedlegg();

    const [files, setFiles] = useState<Record<number, FancyFile[]>>(recordFromMetadatas(metadatas));
    const [innerErrors, setInnerErrors] = useState<Record<number, Error[]>>(recordFromMetadatas(metadatas));
    const [outerErrors, setOuterErrors] = useState<Error[]>([]);
    const { setOppgaverUploadSuccess, setEttersendelseUploadSuccess } = useFilUploadSuccessful();
    const router = useRouter();

    const resetStatus = useCallback(() => {
        setInnerErrors(recordFromMetadatas(metadatas));
        setOuterErrors([]);
        setEttersendelseUploadSuccess(false);
        setOppgaverUploadSuccess(false);
    }, [metadatas, setInnerErrors, setOuterErrors, setOppgaverUploadSuccess, setEttersendelseUploadSuccess]);

    const reset = useCallback(() => {
        setFiles(recordFromMetadatas(metadatas));
        setInnerErrors(recordFromMetadatas(metadatas));
        setOuterErrors([]);
    }, [metadatas, setFiles, setInnerErrors, setOuterErrors]);
    useEffect(reset, [reset]);
    const allFiles = useMemo(() => Object.values(files).flat(), [files]);
    const [leaveConfirmed, setLeaveConfirmed] = useState(false);

    useEffect(() => {
        const beforeUnloadHandler = (event: WindowEventMap["beforeunload"]) => {
            if (!allFiles.length) return;
            event.preventDefault();
            event.returnValue = "";
            logBrukerLeavingBeforeSubmitting();
            return "";
        };
        const beforeRouteHandler = (url: string) => {
            if (!allFiles.length) {
                return;
            }

            if (isSpraakChanging(url, fiksDigisosId)) {
                return;
            }

            if (leaveConfirmed) {
                return;
            }

            logBrukerLeavingBeforeSubmitting();
            if (window.confirm(t("varsling.forlater_siden_uten_aa_sende_inn_vedlegg"))) {
                setLeaveConfirmed(true);
            } else {
                router.events.emit("routeChangeError", url);
                throw `Route change was aborted (this error can be safely ignored)`;
            }
        };

        window.addEventListener("beforeunload", beforeUnloadHandler);
        router.events.on("routeChangeStart", beforeRouteHandler);

        return () => {
            setLeaveConfirmed(false);
            window.removeEventListener("beforeunload", beforeUnloadHandler);
            router.events.off("routeChangeStart", beforeRouteHandler);
        };
    }, [allFiles, fiksDigisosId, leaveConfirmed, router.events, t]);

    const addFiler = useCallback(
        (index: number, _files: File[]) => {
            const _errors: (Error | ErrorWithFile)[] = [];
            logDuplicatedFiles(_files);
            const validFiles = _files.filter((file) => {
                let valid = true;
                if (file.size > maxFileSize) {
                    _errors.push({ fil: file, feil: Feil.FILE_TOO_LARGE });
                    valid = false;
                }
                if (containsIllegalCharacters(file.name)) {
                    _errors.push({ fil: file, feil: Feil.ILLEGAL_FILE_NAME });
                    valid = false;
                }
                return valid;
            });

            if (
                _files.concat(files[index].map((it) => it.file)).reduce((acc, curr) => acc + curr.size, 0) >
                maxCombinedFileSize
            ) {
                _errors.push({ feil: Feil.COMBINED_TOO_LARGE });
            }
            const totalFiles = _files.length + Object.values(files).flat().length;
            if (totalFiles > 20) {
                logger.info(`Bruker prøver å laste opp for mange filer: ${totalFiles}`);
                _errors.push({ feil: Feil.TOO_MANY_FILES });
            }
            setFiles((prev) => ({
                ...prev,
                [index]: [...prev[index], ...validFiles.map((it) => ({ file: it, uuid: crypto.randomUUID() }))],
            }));

            setInnerErrors((prev) => ({ ...prev, [index]: _errors }));
            setOuterErrors([]);
        },
        [files, setInnerErrors, setFiles]
    );

    const removeFil = useCallback(
        (index: number, fil: FancyFile) => {
            const _files = Object.values(files).flat();
            setFiles((prev) => ({ ...prev, [index]: prev[index].filter((it) => it.uuid !== fil.uuid) }));
            // Update "global" errors
            const _errors: (Error | ErrorWithFile)[] = [];
            if (
                _files.filter((it) => it.uuid !== fil.uuid).reduce((acc, curr) => acc + curr.file.size, 0) >
                maxCombinedFileSize
            ) {
                _errors.push({ feil: Feil.COMBINED_TOO_LARGE });
            }
            if (_files.length - 1 > 20) {
                _errors.push({ feil: Feil.TOO_MANY_FILES });
            }

            setInnerErrors((prev) => ({ ...prev, [index]: _errors }));
        },
        [setFiles, files, setInnerErrors]
    );

    const upload = useCallback(async () => {
        if (allFiles.length === 0) {
            logger.info("Validering vedlegg feilet: Ingen filer valgt");
            logAmplitudeEvent("Søker trykte på send vedlegg før et vedlegg har blitt lagt til");
            setOuterErrors([{ feil: Feil.NO_FILES }]);
            return;
        }

        const _metadatas = Object.entries(files)
            .filter((entry) => Boolean(entry[1].length))
            .map(([index, filer]) => {
                const _metadata = metadatas[+index]!;
                return { ..._metadata, filer: filer.map((fil) => ({ uuid: fil.uuid, filnavn: fil.file.name })) };
            });

        const metadataFil = new File([JSON.stringify(_metadatas)], "metadata.json", {
            type: "application/json",
        });

        mutate(
            {
                fiksDigisosId,
                data: {
                    files: [
                        metadataFil,
                        ...allFiles.map((file) => {
                            const ext = path.extname(file.file.name);
                            return new File([file.file], file.uuid + ext, {
                                type: file.file.type,
                                lastModified: file.file.lastModified,
                            });
                        }),
                    ],
                },
            },
            {
                ...options,
                onSuccess: async (data, variables, context) => {
                    options?.onSuccess?.(data, variables, context);
                    const filerData = data.flatMap((response) => response.filer);
                    const errors: Error[] = filerData
                        .filter((it) => it.status !== "OK")
                        .map((it) => ({ feil: determineErrorType(it.status)!, filnavn: it.filnavn }));
                    if (errors.length === 0) {
                        const innsendelseType = data.flatMap((response) => response.hendelsetype);
                        reset();

                        if (
                            innsendelseType.includes("dokumentasjonEtterspurt") ||
                            innsendelseType.includes("dokumentasjonkrav") ||
                            innsendelseType.includes("soknad")
                        ) {
                            setOppgaverUploadSuccess(true);
                        }
                        if (innsendelseType.includes("bruker")) {
                            setEttersendelseUploadSuccess(true);
                        }

                        await queryClient.invalidateQueries({ queryKey: getHentVedleggQueryKey(fiksDigisosId) });
                        await queryClient.invalidateQueries({ queryKey: getHentHendelserQueryKey(fiksDigisosId) });
                    }
                    setOuterErrors(errors);
                },
                onError: (error, variables, context) => {
                    options?.onError?.(error, variables, context);
                    logFileUploadFailedEvent("vedlegg.opplasting_feilmelding");
                    logger.warn("Feil med opplasting av vedlegg: " + error.message);
                    if (error.message === "Mulig virus funnet") {
                        logFileUploadFailedEvent(errorStatusToMessage[Feil.VIRUS]);
                        setOuterErrors([{ feil: Feil.VIRUS }]);
                    } else {
                        logFileUploadFailedEvent(errorStatusToMessage[Feil.KLIENTFEIL]);
                        setOuterErrors([{ feil: Feil.KLIENTFEIL }]);
                    }
                },
            }
        );
    }, [
        mutate,
        fiksDigisosId,
        allFiles,
        metadatas,
        files,
        options,
        queryClient,
        reset,
        setOppgaverUploadSuccess,
        setEttersendelseUploadSuccess,
    ]);

    return {
        mutation: { isLoading: isPending, isError, error, data },
        innerErrors,
        outerErrors,
        upload,
        files,
        addFiler,
        removeFil,
        resetStatus,
    };
};

export default useFilOpplasting;
