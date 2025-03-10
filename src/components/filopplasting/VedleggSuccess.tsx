import React from "react";
import { Alert } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";

import { useFilUploadSuccessful } from "./FilUploadSuccessfulContext";

const VedleggSuccess = ({ show }: { show: boolean }) => {
    const { setOppgaverUploadSuccess, setEttersendelseUploadSuccess } = useFilUploadSuccessful();
    const { t } = useTranslation();
    return show ? (
        <Alert
            className="mt-4"
            variant="success"
            closeButton
            onClose={() => {
                setOppgaverUploadSuccess(false);
                setEttersendelseUploadSuccess(false);
            }}
        >
            {t("vedlegg.suksess")}
        </Alert>
    ) : null;
};
export default VedleggSuccess;
