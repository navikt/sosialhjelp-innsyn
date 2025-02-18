import { Detail } from "@navikt/ds-react";
import React from "react";
import { useTranslation } from "next-i18next";

import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";

const SaksMetaData = ({ oppdatert, status }: { status?: string; oppdatert: string }) => {
    const { t } = useTranslation();

    return (
        <div>
            <Detail as="span">
                {status?.toLowerCase?.() ? t(`soknadstatus.${status.toLowerCase()}`) : "Ukjent status"}
                <span aria-hidden="true"> – </span>
                {t("oppdatert")} <DatoOgKlokkeslett tidspunkt={oppdatert} bareDato={true} />
            </Detail>
        </div>
    );
};
export default SaksMetaData;
