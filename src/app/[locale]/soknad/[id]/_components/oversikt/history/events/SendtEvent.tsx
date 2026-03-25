import { useTranslations } from "next-intl";

import Event from "./Event";
import { forwardRef, Ref } from "react";

interface Props {
    tidspunkt: Date;
    navKontor: string;
}

const SendtEvent = ({ tidspunkt, navKontor }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.SendtEvent");
    return (
        <Event
            ref={ref}
            timestamp={tidspunkt}
            title={t.rich("tittel", { norsk: (chunks) => <span lang="no">{chunks}</span>, navKontor })}
        />
    );
};

export default forwardRef(SendtEvent);
