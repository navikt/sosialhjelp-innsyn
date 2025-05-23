import * as React from "react";
import { useTranslations } from "next-intl";
import { Alert } from "@navikt/ds-react";

import EksternLenke from "../eksternLenke/EksternLenke";
import { useHentForelopigSvarStatus } from "../../generated/forelopig-svar-controller/forelopig-svar-controller";
import { useHentSoknadsStatus } from "../../generated/soknads-status-controller/soknads-status-controller";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";

const ForelopigSvarAlertstripe = () => {
    const soknadId = useFiksDigisosId();
    const t = useTranslations("common");

    const { data: forelopigSvar } = useHentForelopigSvarStatus(soknadId);
    const { data: soknadsStatus } = useHentSoknadsStatus(soknadId);

    if (!forelopigSvar || !soknadsStatus) {
        return null;
    }

    if (forelopigSvar.harMottattForelopigSvar && soknadsStatus.status !== "FERDIGBEHANDLET") {
        return (
            <Alert variant="info">
                {t("forelopigSvar")}
                {forelopigSvar.link && (
                    <EksternLenke href={forelopigSvar.link}>
                        <b>{t("historikk.se_vedtaksbrev")}</b>
                    </EksternLenke>
                )}
            </Alert>
        );
    }
    return null;
};

export default ForelopigSvarAlertstripe;
