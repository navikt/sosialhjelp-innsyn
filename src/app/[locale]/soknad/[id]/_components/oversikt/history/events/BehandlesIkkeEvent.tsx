import { forwardRef, Ref } from "react";
import Event from "../Event";
import { useTranslations } from "next-intl";

interface Props {
    tidspunkt: Date;
}

const BehandlesIkkeEvent = ({ tidspunkt }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.BehandlesIkkeEvent");
    return (
        <Event ref={ref} status="completed" title={t("tittel")} timestamp={tidspunkt}>
            {t("beskrivelse")}
        </Event>
    );
};

export default forwardRef(BehandlesIkkeEvent);
