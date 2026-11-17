import { forwardRef, Ref } from "react";
import { useTranslations } from "next-intl";

import Event from "./Event";

interface Props {
    tidspunkt: Date;
}

const KlageSendtEvent = ({ tidspunkt }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.KlageSendtEvent");
    return <Event ref={ref} title={t("tittel")} timestamp={tidspunkt} />;
};

export default forwardRef(KlageSendtEvent);
