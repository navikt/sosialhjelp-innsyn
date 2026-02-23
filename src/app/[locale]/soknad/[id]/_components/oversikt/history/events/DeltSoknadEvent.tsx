import Event from "./Event";
import { useTranslations } from "next-intl";

interface Props {
    timestamp: Date;
}

const DeltSoknadEvent = ({ timestamp }: Props) => {
    const t = useTranslations("History.DeltSoknadEvent");
    return (
        <Event title={t("tittel")} timestamp={timestamp}>
            {t("beskrivelse")}
        </Event>
    );
};

export default DeltSoknadEvent;
