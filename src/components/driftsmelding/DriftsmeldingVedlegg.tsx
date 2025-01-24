import * as React from "react";
import { useTranslation } from "next-i18next";

import { useFileUploadError } from "./useFileUploadError";
import { DriftsmeldingAlert } from "./DriftsmeldingAlert";

const DriftsmeldingVedlegg = ({ className }: { className?: string }) => {
    const fileUploadError = useFileUploadError();
    const { t } = useTranslation();

    return !fileUploadError ? null : (
        <DriftsmeldingAlert className={className}>{t(fileUploadError)}</DriftsmeldingAlert>
    );
};

export default DriftsmeldingVedlegg;
