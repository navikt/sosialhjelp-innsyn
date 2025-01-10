import {Detail} from "@navikt/ds-react";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import React, {useEffect} from "react";
import {useTranslation} from "next-i18next";
import {logger} from "@navikt/next-logger";

interface Props {
    status?: string;
    oppdatert: string;
}
const SaksMetaData = (props: Props) => {
    const {t} = useTranslation();
    useEffect(() => {
        if (!props.status?.toLowerCase) {
            logger.warn("status is not a string in SaksMetaData? Status: " + props.status);
        }
    }, [props.status]);
    return (
        <>
            <Detail as="span">
                {props.status?.toLowerCase?.() ? t(`soknadstatus.${props.status.toLowerCase()}`) : "Ukjent status"}
            </Detail>
            <span aria-hidden="true"> ● </span>
            <span className="sr-only"></span>
            <Detail as="span">
                {t("oppdatert")} <DatoOgKlokkeslett tidspunkt={props.oppdatert} bareDato={true} />
            </Detail>
        </>
    );
};
export default SaksMetaData;
