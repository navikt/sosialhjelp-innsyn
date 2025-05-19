import * as React from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@navikt/ds-react";
import cx from "classnames";

import { useFileUploadError } from "./lib/useFileUploadError";

const DriftsmeldingVedlegg = ({ className }: { className?: string }) => {
    const fileUploadError = useFileUploadError();
    const t = useTranslations("common");

    return !fileUploadError ? null : (
        <Alert variant="error" size="medium" inline className={cx("font-bold", className)}>
            {t(fileUploadError)}
        </Alert>
    );
};

export default DriftsmeldingVedlegg;
