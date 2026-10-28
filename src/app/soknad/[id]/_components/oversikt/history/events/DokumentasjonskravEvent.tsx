import React, { forwardRef, Ref } from "react";
import { useTranslations } from "next-intl";
import Event from "./Event";

interface Props {
    tidspunkt: Date;
}

const DokumentasjonskravEvent = ({ tidspunkt }: Props, ref: Ref<HTMLLIElement>): React.JSX.Element => {
    const t = useTranslations("History.DokumentasjonskravEvent");
    return <Event ref={ref} title={t("tittel")} timestamp={tidspunkt} />;
};

export default forwardRef(DokumentasjonskravEvent);
