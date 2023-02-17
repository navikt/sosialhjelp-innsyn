import React, {ReactElement} from "react";
import FileItemView from "../vedlegg/FileItemView";
import {ErrorMessage} from "../errors/ErrorMessage";
import {errorStatusToMessage} from "../../hooks/useFilOpplasting";
import {useTranslation} from "react-i18next";
import {Error} from "../../hooks/useFilOpplasting";

interface Props {
    files: File[];
    onDelete: (file: File) => void;
    errors: Error[];
}

const OppgaveElementUploadBox = ({files, onDelete, errors}: Props): ReactElement => {
    const {t} = useTranslation();
    return (
        <>
            <FileItemView filer={files} onDelete={(_, fil) => onDelete(fil)} />
            {errors.length > 0 && (
                <div>
                    {errors.length === 1 ? (
                        <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">
                            {t("vedlegg.ulovlig_en_fil_feilmelding", {
                                filnavn: errors[0]?.fil?.name,
                            })}
                        </ErrorMessage>
                    ) : (
                        <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift">
                            {t("vedlegg.ulovlig_flere_fil_feilmelding", {
                                antallFiler: errors.length,
                            })}
                        </ErrorMessage>
                    )}
                    {errors.map((key, i) => (
                        <ErrorMessage className="oppgaver_vedlegg_feilmelding_overskrift" key={i}>
                            {t(errorStatusToMessage[key.errorType])}
                        </ErrorMessage>
                    ))}
                </div>
            )}
        </>
    );
};

export default OppgaveElementUploadBox;
