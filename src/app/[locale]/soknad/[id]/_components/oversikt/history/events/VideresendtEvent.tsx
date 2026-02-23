import { forwardRef, Ref } from "react";
import Event from "./Event";
import { useTranslations } from "next-intl";

interface Props {
    tidspunkt?: Date;
    navKontor: string;
}

const VideresendtEvent = ({ tidspunkt, navKontor }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.VideresendtEvent");
    return (
        <Event
            status="completed"
            timestamp={tidspunkt}
            ref={ref}
            title={t.rich("tittel", { norsk: (chunks) => <span lang="no">{chunks}</span>, navKontor })}
        >
            {t("beskrivelse")}
        </Event>
    );
};

export default forwardRef(VideresendtEvent);
