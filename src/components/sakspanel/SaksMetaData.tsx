import { Detail } from "@navikt/ds-react";
import React from "react";
import { useTranslations } from "next-intl";

import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import { SaksDetaljerResponseStatus } from "../../generated/model";

const SaksMetaData = ({ oppdatert, status }: { status?: SaksDetaljerResponseStatus; oppdatert: string }) => {
    const t = useTranslations("common");

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
