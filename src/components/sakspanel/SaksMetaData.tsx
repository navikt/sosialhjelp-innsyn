import {Detail} from "@navikt/ds-react";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import React from "react";
import {useTranslation} from "react-i18next";

interface Props {
    status: string;
    oppdatert: string;
}
const SaksMetaData = (props: Props) => {
    const {t} = useTranslation();
    return (
        <>
            <Detail as="span">{t(`status.${props.status.toLowerCase()}`)}</Detail>
            <span aria-hidden="true"> ● </span>
            <Detail as="span">
                {t("oppdatert")} <DatoOgKlokkeslett tidspunkt={props.oppdatert} bareDato={true} />
            </Detail>
        </>
    );
};
export default SaksMetaData;
