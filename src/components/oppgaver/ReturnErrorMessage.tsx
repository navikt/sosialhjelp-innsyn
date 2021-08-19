import React from "react";
import ErrorMessage from "./ErrorMessage";
import ErrorMessageTitle from "./ErrorMessageTitle";

const ReturnErrorMessage = (flagg: any, filnavn: any, listeMedFil: any) => {
    if (flagg.containsUlovligeTegn && !flagg.ulovligFiler) {
        return (
            <>
                <ErrorMessageTitle
                    feilId="vedlegg.ulovlig_en_filnavn_feilmelding"
                    filnavn={filnavn}
                    listeMedFil={listeMedFil}
                />
                <ul className="oppgaver_vedlegg_feilmelding_ul_plassering">
                    <ErrorMessage feilId="vedlegg.ulovlig_filnavn_feilmelding" />
                </ul>
            </>
        );
    }

    if (flagg.maxFilStorrelse && !flagg.ulovligFiler) {
        return (
            <>
                <ErrorMessageTitle
                    feilId="vedlegg.ulovlig_en_filstorrelse_feilmelding"
                    filnavn={filnavn}
                    listeMedFil={listeMedFil}
                />
                <ul className="oppgaver_vedlegg_feilmelding_ul_plassering">
                    <ErrorMessage feilId="vedlegg.ulovlig_filstorrelse_feilmelding" />
                </ul>
            </>
        );
    }

    if (flagg.ulovligFiler) {
        return (
            <>
                <ErrorMessageTitle
                    feilId="vedlegg.ulovlig_flere_fil_feilmelding"
                    filnavn=""
                    listeMedFil={listeMedFil}
                />
                <ul className="oppgaver_vedlegg_feilmelding_ul_plassering">
                    {flagg.containsUlovligeTegn && <ErrorMessage feilId="vedlegg.ulovlig_filnavn_feilmelding" />}
                    {flagg.maxFilStorrelse && <ErrorMessage feilId="vedlegg.ulovlig_filstorrelse_feilmelding" />}
                </ul>
            </>
        );
    }

    if (flagg.maxSammensattFilStorrelse) {
        return (
            <>
                <ErrorMessageTitle
                    feilId="vedlegg.ulovlig_storrelse_av_alle_valgte_filer"
                    filnavn=""
                    listeMedFil={listeMedFil}
                />
            </>
        );
    }
};

export default ReturnErrorMessage;
