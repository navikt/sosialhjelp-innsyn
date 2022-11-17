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
    handleFileUploadFailedInBackend: (filResponse: any) => void,
    //handleFileUploadFailedInBackend: (filnavn: string, filStatus: string | undefined, fil: File | undefined) => void,
    onSuccessful: (reference: string) => void
) => {
    //let backendResponse = undefined;
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
                console.log("WOAH THERE REALLY IS AN ERROR WTF");
                handleFileUploadFailedInBackend(files);
            } else {
                console.log("ALLS WELL THAT ENDS WELL");
                onSuccessful(reference);
            }
        })
        .catch((e) => {
            console.log("feil funnet", e);
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
