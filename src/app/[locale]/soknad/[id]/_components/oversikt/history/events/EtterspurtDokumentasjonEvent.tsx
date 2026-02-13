import { useTranslations } from "next-intl";

import Event from "../Event";
import { forwardRef, Ref } from "react";
import { Link } from "@navikt/ds-react";

interface Props {
    tidspunkt: Date;
    navKontor: string;
    url?: string;
}

const EtterspurtDokumentasjonEvent = ({ tidspunkt, navKontor, url }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.EtterspurtDokumentasjonEvent");
    return (
        <Event
            ref={ref}
            title={t.rich("tittel", { norsk: (chunks) => <span lang="no">{chunks}</span>, navKontor })}
            status="completed"
            timestamp={tidspunkt}
        >
            {url && (
                <Link href={url} className="text-ax-text-accent-subtle">
                    Les brevet
                </Link>
            )}
        </Event>
    );
};

export default forwardRef(EtterspurtDokumentasjonEvent);
