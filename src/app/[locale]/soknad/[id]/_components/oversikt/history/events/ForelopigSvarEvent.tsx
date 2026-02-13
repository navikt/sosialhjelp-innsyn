import { useTranslations } from "next-intl";

import Event from "../Event";
import { forwardRef, Ref } from "react";

interface Props {
    tidspunkt: Date;
    navKontor: string;
}

const ForelopigSvarEvent = ({ tidspunkt, navKontor }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.ForelopigSvarEvent");
    return (
        <Event
            ref={ref}
            title={t.rich("tittel", { norsk: (chunks) => <span lang="no">{chunks}</span>, navKontor })}
            status="completed"
            timestamp={tidspunkt}
        />
    );
};

export default forwardRef(ForelopigSvarEvent);
