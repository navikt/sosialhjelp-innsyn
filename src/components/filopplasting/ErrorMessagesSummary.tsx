import React from "react";
import { useTranslations } from "next-intl";
import { ErrorMessage } from "@navikt/ds-react";

import { Error, ErrorWithFile } from "./useFilOpplasting";
import styles from "./filopplasting.module.css";

export const dedupeErrorsByProp = <T extends Error, K extends keyof T>(errors: T[], prop: K) => {
    return errors?.filter((v, i, a) => a.findIndex((v2) => v2[prop] === v[prop]) === i);
};

interface Props {
    errors: ErrorWithFile[];
}
const ErrorMessagesSummary = ({ errors }: Props) => {
    const uniqueFilesWithError = dedupeErrorsByProp(errors, "fil");
    const t = useTranslations("common.vedlegg");

    if (uniqueFilesWithError.length > 1) {
        return (
            <ErrorMessage className={styles.innerError}>
                {t("ulovlig_flere_fil_feilmelding", {
                    antallFiler: uniqueFilesWithError.length,
                })}
            </ErrorMessage>
        );
    }
    if (uniqueFilesWithError.length === 1) {
        return (
            <ErrorMessage className={styles.innerError}>
                {t("ulovlig_en_fil_feilmelding", {
                    filnavn: uniqueFilesWithError[0].fil?.name,
                })}
            </ErrorMessage>
        );
    }
    return null;
};

export default ErrorMessagesSummary;
