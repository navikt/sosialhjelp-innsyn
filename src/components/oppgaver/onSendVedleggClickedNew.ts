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
    onSuccessful: (reference: string) => void
) => {
    fetchPost(path, formData, "multipart/form-data")
        .then(() => onSuccessful(reference))
        .catch((e) => {
            // Kjør feilet kall på nytt for å få tilgang til feilmelding i JSON data:
            fetchPostGetErrors(path, formData, "multipart/form-data").then((errorResponse: any) => {
                if (errorResponse.message === "Mulig virus funnet") {
                    handleFileWithVirus();
                }
            });
            handleFileUploadFailed();
            logWarningMessage("Feil med opplasting av vedlegg: " + e.message);
        });
};
