import React from "react";
import {useTranslation} from "next-i18next";
import {ErrorMessage} from "@navikt/ds-react";

import {Error} from "./useFilOpplasting";
import styles from "./filopplasting.module.css";

export const dedupeErrorsByProp = (errors: Error[], prop: "fil" | "feil") => {
    return errors?.filter((v, i, a) => a.findIndex((v2) => v2[prop] === v[prop]) === i);
};

interface Props {
    errors: Error[];
}
const ErrorMessagesSummary = ({errors}: Props) => {
    const errorsWithFile = errors.filter((error) => error.fil);

    const uniqueFilesWithError = dedupeErrorsByProp(errorsWithFile, "fil");
    const {t} = useTranslation();

    if (uniqueFilesWithError.length > 1) {
        return (
            <ErrorMessage className={styles.innerError}>
                {t("vedlegg.ulovlig_flere_fil_feilmelding", {
                    antallFiler: uniqueFilesWithError.length,
                })}
            </ErrorMessage>
        );
    }
    if (uniqueFilesWithError.length === 1) {
        return (
            <ErrorMessage className={styles.innerError}>
                {t("vedlegg.ulovlig_en_fil_feilmelding", {
                    filnavn: uniqueFilesWithError[0]?.fil?.name,
                })}
            </ErrorMessage>
        );
    }
    return null;
};

export default ErrorMessagesSummary;
