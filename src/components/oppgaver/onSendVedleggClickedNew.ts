import {Fil} from "../../redux/innsynsdata/innsynsdataReducer";
import {fetchPost, fetchPostGetErrors} from "../../utils/restUtils";
import {logWarningMessage} from "../../redux/innsynsdata/loggActions";

export const onSendVedleggClicked = (
    reference: string,
    formData: FormData,
    filer: Fil[],
    path: string,
    handleFileResponse: (fil: {filnavn: string}, status: string) => void,
    handleFileWithVirus: (reference: string) => void,
    handleFileUploadFailed: (reference: string) => void,
    onSuccessful: () => void
) => {
    fetchPost(path, formData, "multipart/form-data")
        .then((fileResponse: any) => {
            if (Array.isArray(fileResponse)) {
                fileResponse.forEach((response) => {
                    response.filer.forEach((fil: Fil, index: number) => {
                        handleFileResponse({filnavn: fil.filnavn}, fil.status ?? "");
                    });
                });
            }
            onSuccessful();
        })
        .catch((e) => {
            // Kjør feilet kall på nytt for å få tilgang til feilmelding i JSON data:
            fetchPostGetErrors(path, formData, "multipart/form-data").then((errorResponse: any) => {
                if (errorResponse.message === "Mulig virus funnet") {
                    handleFileWithVirus(reference);
                }
            });
            handleFileUploadFailed(reference);
            logWarningMessage("Feil med opplasting av vedlegg: " + e.message);
        });
};
