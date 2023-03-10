import React, {ReactElement} from "react";
import FileItemView from "../vedlegg/FileItemView";
import ErrorMessagePlaceholder, {ErrorMessage} from "../errors/ErrorMessage";
import {errorStatusToMessage} from "../../hooks/useFilOpplasting";
import {useTranslation} from "react-i18next";
import {Error} from "../../hooks/useFilOpplasting";

interface Props {
    files: File[];
    onDelete: (file: File) => void;
    errors: Error[];
}

const dedupeErrorsByProp = (errors: Error[], prop: "fil" | "feil") =>
    errors.filter((v, i, a) => a.findIndex((v2) => v2[prop] === v[prop]) === i);

const OppgaveElementUploadBox = ({files, onDelete, errors}: Props): ReactElement => {
    const {t} = useTranslation();

    const uniqueErrors = dedupeErrorsByProp(errors, "feil");
    return (
        <>
            <ErrorMessagePlaceholder>
                {errors.length > 0 && (
                    <>
                        <ErrorMessagesSummary errors={errors} />
                        <ul>
                            {uniqueErrors.map((key, i) => (
                                <li key={i}>
                                    <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">
                                        {t(errorStatusToMessage[key.feil])}
                                    </ErrorMessage>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </ErrorMessagePlaceholder>
            <FileItemView filer={files} onDelete={(_, fil) => onDelete(fil)} />
        </>
    );
};

const ErrorMessagesSummary = ({errors}: {errors: Error[]}) => {
    const errorsWithFile = errors.filter((error) => error.fil);
    const uniqueFilesWithError = dedupeErrorsByProp(errorsWithFile, "fil");
    const {t} = useTranslation();

    if (uniqueFilesWithError.length > 1) {
        return (
            <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">
                {t("vedlegg.ulovlig_flere_fil_feilmelding", {
                    antallFiler: uniqueFilesWithError.length,
                })}
            </ErrorMessage>
        );
    }
    if (uniqueFilesWithError.length === 1) {
        return (
            <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">
                {t("vedlegg.ulovlig_en_fil_feilmelding", {
                    filnavn: uniqueFilesWithError[0]?.fil?.name,
                })}
            </ErrorMessage>
        );
    }
    return null;
};

export default OppgaveElementUploadBox;
