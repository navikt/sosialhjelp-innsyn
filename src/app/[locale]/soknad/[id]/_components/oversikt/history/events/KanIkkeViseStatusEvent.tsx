import { forwardRef, Ref } from "react";
import Event from "../Event";
import { useTranslations } from "next-intl";

interface Props {
    tidspunkt: Date;
}

const KanIkkeViseStatusEvent = ({ tidspunkt }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.KanIkkeViseStatusEvent");
    return (
        <Event ref={ref} status="completed" title={t("tittel")} timestamp={tidspunkt}>
            {t("beskrivelse")}
        </Event>
    );
};

export default forwardRef(KanIkkeViseStatusEvent);
