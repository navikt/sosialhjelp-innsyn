import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useNavigationGuard } from "next-navigation-guard";

import { FancyFile, Error } from "./types";
import { validateFile, getOuterErrors } from "./utils/validateFiles";

const useFiles = () => {
    const t = useTranslations("common");

    const [files, setFiles] = useState<FancyFile[]>([]);
    const [outerErrors, setOuterErrors] = useState<Error[]>([]);

    useNavigationGuard({
        enabled: files.length > 0,
        confirm: () => {
            return window.confirm(t("varsling.forlater_siden_uten_aa_sende_inn_vedlegg"));
        },
    });

    const reset = useCallback(() => {
        setFiles([]);
        setOuterErrors([]);
    }, [setFiles, setOuterErrors]);
    useEffect(reset, [reset]);

    const addFiler = useCallback(
        (_files: File[]) => {
            const updatedFiles = files.concat(
                _files.map((file) => {
                    const error = validateFile(file);
                    return {
                        file,
                        uuid: crypto.randomUUID(),
                        ...(error && { error }),
                    };
                })
            );

            const _outerErrors = getOuterErrors(updatedFiles);

            setFiles(updatedFiles);
            setOuterErrors(_outerErrors);
        },
        [files, setFiles]
    );

    const removeFil = useCallback(
        (fil: FancyFile) => {
            const updatedFiles = files.filter((it) => it.uuid !== fil.uuid);
            const _outerErrors = getOuterErrors(updatedFiles);

            setFiles(updatedFiles);
            setOuterErrors(() => _outerErrors);
        },
        [setFiles, files]
    );

    return {
        outerErrors,
        files,
        addFiler,
        setOuterErrors,
        removeFil,
        reset,
    };
};

export default useFiles;
