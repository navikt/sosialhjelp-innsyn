import * as React from "react";
import { useTranslation } from "next-i18next";
import { Alert } from "@navikt/ds-react";
import cx from "classnames";

import { useFileUploadError } from "./useFileUploadError";

const DriftsmeldingVedlegg = ({ className }: { className?: string }) => {
    const fileUploadError = useFileUploadError();
    const { t } = useTranslation();

    return !fileUploadError ? null : (
        <Alert variant="error" size="medium" inline className={cx("font-bold", className)}>
            {t(fileUploadError)}
        </Alert>
    );
};

export default DriftsmeldingVedlegg;
