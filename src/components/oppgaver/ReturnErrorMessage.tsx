import React from "react";
import ErrorMessage from "./ErrorMessage";
import ErrorMessageTitle from "./ErrorMessageTitle";

const ReturnErrorMessage = (flagg: any, filnavn: any, listeMedFil: any) => {
    return (
        <ul className="oppgaver_vedlegg_feilmelding_ul_plassering">
            {flagg.ulovligFiltype && ErrorMessageTitle("vedlegg.ulovlig_en_filtype_feilmelding", filnavn, listeMedFil)}
            {flagg.ulovligFilnavn && ErrorMessageTitle("vedlegg.ulovlig_en_filnavn_feilmelding", filnavn, listeMedFil)}
            {flagg.ulovligFilstorrelse &&
                ErrorMessageTitle("vedlegg.ulovlig_en_filstorrelse_feilmelding", filnavn, listeMedFil)}
            {flagg.ulovligFiler && ErrorMessageTitle("vedlegg.ulovlig_flere_fil_feilmelding", "", listeMedFil)}
            {flagg.maxSammensattFilStorrelse &&
                ErrorMessageTitle("vedlegg.ulovlig_storrelse_av_alle_valgte_filer", "", listeMedFil)}
            {flagg.containsUlovligeTegn && ErrorMessage("vedlegg.ulovlig_filnavn_feilmelding")}
            {flagg.legalFileExtension && ErrorMessage("vedlegg.ulovlig_filtype_feilmelding")}
            {flagg.maxFilStorrelse && ErrorMessage("vedlegg.ulovlig_filstorrelse_feilmelding")}
        </ul>
    );
};

export default ReturnErrorMessage;
