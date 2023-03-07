import React from "react";
import {ErrorMessage} from "../errors/ErrorMessage";
import ErrorMessageTitle from "./ErrorMessageTitle";
import {useTranslation} from "react-i18next";
import {FileError} from "../../utils/vedleggUtils";

const writeErrorMessage = (listeMedFil: Array<FileError>, oppgaveElementIndex: number) => {
    let filnavn = "";

    const flagg = {
        ulovligFiler: false,
        containsUlovligeTegn: false,
        maxFilStorrelse: false,
        maxSammensattFilStorrelse: false,
    };

    listeMedFil.forEach((value) => {
        if (value.oppgaveElementIndex === oppgaveElementIndex) {
            if (value.containsIllegalCharacters || value.legalFileSize || value.legalCombinedFilesSize) {
                if (listeMedFil.length === 1) {
                    filnavn = listeMedFil.length === 1 ? listeMedFil[0].filename : "";
                } else {
                    flagg.ulovligFiler = true;
                }
                if (value.legalFileSize) {
                    flagg.maxFilStorrelse = true;
                }
                if (value.containsIllegalCharacters) {
                    flagg.containsUlovligeTegn = true;
                }
                if (value.legalCombinedFilesSize) {
                    flagg.maxSammensattFilStorrelse = true;
                    flagg.maxFilStorrelse = false;
                    flagg.containsUlovligeTegn = false;
                    flagg.ulovligFiler = false;
                }
            }
        }
    });

    return {flagg, filnavn};
};

interface Props {
    listeMedFil: Array<FileError>;
    oppgaveElementIndex: number;
}
const ReturnErrorMessage = (props: Props) => {
    const {t} = useTranslation();

    const {flagg, filnavn} = writeErrorMessage(props.listeMedFil, props.oppgaveElementIndex);
    if (flagg.containsUlovligeTegn && !flagg.ulovligFiler) {
        return (
            <>
                <ErrorMessageTitle
                    feilId="vedlegg.ulovlig_en_filnavn_feilmelding"
                    filnavn={filnavn}
                    listeMedFil={props.listeMedFil}
                />
                <ErrorMessage>{t("vedlegg.ulovlig_filnavn_feilmelding")}</ErrorMessage>
            </>
        );
    }

    if (flagg.maxFilStorrelse && !flagg.ulovligFiler) {
        return (
            <>
                <ErrorMessageTitle
                    feilId="vedlegg.ulovlig_en_filstorrelse_feilmelding"
                    filnavn={filnavn}
                    listeMedFil={props.listeMedFil}
                />
                <ErrorMessage>{t("vedlegg.ulovlig_filstorrelse_feilmelding")}</ErrorMessage>
            </>
        );
    }

    if (flagg.ulovligFiler) {
        return (
            <>
                <ErrorMessageTitle
                    feilId="vedlegg.ulovlig_flere_fil_feilmelding"
                    filnavn=""
                    listeMedFil={props.listeMedFil}
                />
                {flagg.containsUlovligeTegn || flagg.maxFilStorrelse}
                <ul>
                    {flagg.containsUlovligeTegn && (
                        <li>
                            <ErrorMessage>{t("vedlegg.ulovlig_filnavn_feilmelding")}</ErrorMessage>
                        </li>
                    )}
                    {flagg.maxFilStorrelse && (
                        <li>
                            <ErrorMessage>{t("vedlegg.ulovlig_filstorrelse_feilmelding")}</ErrorMessage>
                        </li>
                    )}
                </ul>
            </>
        );
    }

    if (flagg.maxSammensattFilStorrelse) {
        return (
            <ErrorMessageTitle
                feilId="vedlegg.ulovlig_storrelse_av_alle_valgte_filer"
                filnavn=""
                listeMedFil={props.listeMedFil}
            />
        );
    }

    return null;
};

export default ReturnErrorMessage;
