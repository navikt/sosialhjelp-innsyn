import { useTranslations } from "next-intl";

import Event from "../Event";
import { forwardRef, Ref } from "react";

interface Props {
    tidspunkt: Date;
}

const EtterspurtDokumentasjonLevertEvent = ({ tidspunkt }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.EtterspurtDokumentasjonLevertEvent");
    return <Event ref={ref} title={t("tittel")} status="completed" timestamp={tidspunkt} />;
};

export default forwardRef(EtterspurtDokumentasjonLevertEvent);
