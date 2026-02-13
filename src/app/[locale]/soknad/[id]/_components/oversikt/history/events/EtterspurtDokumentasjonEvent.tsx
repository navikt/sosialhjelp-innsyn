import { useTranslations } from "next-intl";

import Event from "../Event";
import { forwardRef, Ref } from "react";

interface Props {
    tidspunkt: Date;
    navKontor: string;
}

const EtterspurtDokumentasjonEvent = ({ tidspunkt, navKontor }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.EtterspurtDokumentasjonEvent");
    return (
        <Event
            ref={ref}
            title={t.rich("tittel", { norsk: (chunks) => <span lang="no">{chunks}</span>, navKontor })}
            status="completed"
            timestamp={tidspunkt}
        />
    );
};

export default forwardRef(EtterspurtDokumentasjonEvent);
