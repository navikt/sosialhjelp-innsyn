import React, {useCallback, useEffect, useMemo, useState} from "react";
import {UseMutationOptions, useQueryClient} from "@tanstack/react-query";
import {fileUploadFailedEvent, logDuplicatedFiles} from "../../utils/amplitude";
import {SendVedleggBody, VedleggOpplastingResponseStatus} from "../../generated/model";
import {containsIllegalCharacters, maxCombinedFileSize, maxFileSize} from "../../utils/vedleggUtils";
import {
    getHentVedleggQueryKey,
    sendVedlegg,
    useSendVedlegg,
} from "../../generated/vedlegg-controller/vedlegg-controller";
import {ErrorType} from "../../axios-instance";
import {logInfoMessage, logWarningMessage} from "../../redux/innsynsdata/loggActions";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import {getHentHendelserQueryKey} from "../../generated/hendelse-controller/hendelse-controller";
import {useFilUploadSuccessful} from "./FilUploadSuccessfulContext";

export interface Metadata {
    type: string;
    tilleggsinfo: string | undefined;
    innsendelsesfrist: string | undefined;
    hendelsetype: string | undefined;
    hendelsereferanse: string | undefined;
}

export interface Error {
    fil?: File;
    filnavn?: string;
    feil: Feil;
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
    metadatas.reduce((acc, curr, currentIndex) => ({...acc, [currentIndex]: []}), {});

const useFilOpplasting = (
    metadatas: Metadata[],
    options?: UseMutationOptions<
        Awaited<ReturnType<typeof sendVedlegg>>,
        ErrorType<unknown>,
        {fiksDigisosId: string; data: SendVedleggBody}
    >
) => {
    const queryClient = useQueryClient();
    const fiksDigisosId = useFiksDigisosId();
    const {isLoading, mutate, error, isError, data} = useSendVedlegg();

    const [files, setFiles] = useState<Record<number, File[]>>(recordFromMetadatas(metadatas));
    const [innerErrors, setInnerErrors] = useState<Record<number, Error[]>>(recordFromMetadatas(metadatas));
    const [outerErrors, setOuterErrors] = useState<Error[]>([]);
    const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);

    const resetStatus = useCallback(() => {
        setInnerErrors(recordFromMetadatas(metadatas));
        setOuterErrors([]);
        setShowSuccessAlert(false);
    }, [metadatas, setInnerErrors, setOuterErrors]);

    const reset = useCallback(() => {
        setFiles(recordFromMetadatas(metadatas));
        setInnerErrors(recordFromMetadatas(metadatas));
        setOuterErrors([]);
    }, [metadatas, setFiles, setInnerErrors, setOuterErrors]);
    useEffect(reset, [reset]);
    const allFiles = useMemo(() => Object.values(files).flat(), [files]);
    const {setUploadSuccessful} = useFilUploadSuccessful();

    /*
    // TODO: denne endte opp i en loop så kommenterer ut intill vi har funnet en løsning
    useEffect(() => {
        if (allFiles.length) {
            window.addEventListener("beforeunload", alertUser);
        }
        return () => window.removeEventListener("beforeunload", alertUser);
    }, [allFiles]);

     */
    const addFiler = useCallback(
        (index: number, _files: File[]) => {
            const _errors: Error[] = [];
            logDuplicatedFiles(_files);
            const validFiles = _files.filter((file) => {
                let valid = true;
                if (file.size > maxFileSize) {
                    _errors.push({fil: file, feil: Feil.FILE_TOO_LARGE});
                    valid = false;
                }
                if (containsIllegalCharacters(file.name)) {
                    _errors.push({fil: file, feil: Feil.ILLEGAL_FILE_NAME});
                    valid = false;
                }
                return valid;
            });

            if (_files.concat(files[index]).reduce((acc, curr) => acc + curr.size, 0) > maxCombinedFileSize) {
                _errors.push({feil: Feil.COMBINED_TOO_LARGE});
            }
            setFiles((prev) => ({...prev, [index]: [...prev[index], ...validFiles]}));

            setInnerErrors((prev) => ({...prev, [index]: _errors}));
            setOuterErrors([]);
        },
        [files, setInnerErrors, setFiles]
    );
    const removeFil = useCallback(
        (index: number, fil: File) => {
            setFiles((prev) => ({...prev, [index]: prev[index].filter((it) => it !== fil)}));
        },
        [setFiles]
    );
    const upload = useCallback(async () => {
        if (allFiles.length === 0) {
            logInfoMessage("Validering vedlegg feilet: Ingen filer valgt");
            setOuterErrors([{feil: Feil.NO_FILES}]);
            return;
        }
        const _metadatas = Object.entries(files)
            .filter(([_, filer]) => Boolean(filer.length))
            .map(([index, filer]) => {
                const _metadata = metadatas[+index]!;
                return {..._metadata, filer: filer.map((fil) => ({filnavn: fil.name}))};
            });
        const metadataFil = new File([JSON.stringify(_metadatas)], "metadata.json", {
            type: "application/json",
        });

        mutate(
            {
                fiksDigisosId,
                data: {
                    files: [metadataFil, ...allFiles],
                },
            },
            {
                ...options,
                onSuccess: async (data, variables, context) => {
                    options?.onSuccess?.(data, variables, context);
                    const filerData = data.flatMap((response) => response.filer);
                    const errors: Error[] = filerData
                        .filter((it) => it.status !== "OK")
                        .map((it) => ({feil: determineErrorType(it.status)!, filnavn: it.filnavn}));
                    if (errors.length === 0) {
                        reset();
                        setShowSuccessAlert(true);
                        setUploadSuccessful(true);

                        await queryClient.invalidateQueries(getHentVedleggQueryKey(fiksDigisosId));
                        await queryClient.invalidateQueries(getHentHendelserQueryKey(fiksDigisosId));
                    }
                    setOuterErrors(errors);
                },
                onError: (error, variables, context) => {
                    options?.onError?.(error, variables, context);
                    fileUploadFailedEvent("vedlegg.opplasting_feilmelding");
                    logWarningMessage("Feil med opplasting av vedlegg: " + error.message);
                    if (error.message === "Mulig virus funnet") {
                        fileUploadFailedEvent(errorStatusToMessage[Feil.VIRUS]);
                        setOuterErrors([{feil: Feil.VIRUS}]);
                    } else {
                        fileUploadFailedEvent(errorStatusToMessage[Feil.KLIENTFEIL]);
                        setOuterErrors([{feil: Feil.KLIENTFEIL}]);
                    }
                },
            }
        );
    }, [mutate, fiksDigisosId, allFiles, metadatas, files, options, queryClient, reset, setUploadSuccessful]);

    return {
        mutation: {isLoading, isError, error, data},
        innerErrors,
        outerErrors,
        upload,
        files,
        addFiler,
        removeFil,
        resetStatus,
        showSuccessAlert,
    };
};

export default useFilOpplasting;
