import {Fil} from "../../redux/innsynsdata/innsynsdataReducer";
import {fetchPost, fetchPostGetErrors} from "../../utils/restUtils";
import {logWarningMessage} from "../../redux/innsynsdata/loggActions";

export const onSendVedleggClicked = (
    reference: string,
    formData: FormData,
    filer: Fil[],
    path: string,
    handleFileWithVirus: () => void,
    handleFileUploadFailed: () => void,
    handleFileUploadFailedInBackend: (filResponse: Fil[], reference: string) => void,
    onSuccessful: (reference: string) => void
) => {
    fetchPost(path, formData, "multipart/form-data")
        .then((fileResponse: any) => {
            let hasError: boolean = false;
            let files: Fil[] = [];
            if (Array.isArray(fileResponse)) {
                fileResponse.forEach((response) => {
                    response.filer.forEach((fil: Fil) => {
                        if (fil.status !== "OK") {
                            hasError = true;
                            files.push(fil);
                        }
                    });
                });
            }
            if (hasError) {
                handleFileUploadFailedInBackend(files, reference);
            } else {
                onSuccessful(reference);
            }
        })
        .catch((e) => {
            // Kjør feilet kall på nytt for å få tilgang til feilmelding i JSON data:
            fetchPostGetErrors(path, formData, "multipart/form-data").then((errorResponse: any) => {
                if (errorResponse.message === "Mulig virus funnet") {
                    handleFileWithVirus();
                } else if (errorResponse.message === "Klientfeil") {
                    handleFileUploadFailed();
                }
            });
            handleFileUploadFailed();
            logWarningMessage("Feil med opplasting av vedlegg: " + e.message);
        });
};
