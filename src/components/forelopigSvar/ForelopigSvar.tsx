import * as React from "react";
import {useTranslation} from "next-i18next";
import EksternLenke from "../eksternLenke/EksternLenke";
import {Alert} from "@navikt/ds-react";
import {useHentForelopigSvarStatus} from "../../generated/forelopig-svar-controller/forelopig-svar-controller";
import {useHentSoknadsStatus} from "../../generated/soknads-status-controller/soknads-status-controller";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";

const ForelopigSvarAlertstripe: React.FC = () => {
    const soknadId = useFiksDigisosId();
    const {t} = useTranslation();

    const {data: forelopigSvar} = useHentForelopigSvarStatus(soknadId as string);
    const {data: soknadsStatus} = useHentSoknadsStatus(soknadId as string);

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
