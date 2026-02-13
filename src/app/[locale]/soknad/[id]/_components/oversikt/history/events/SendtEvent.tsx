import { Link } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import Event from "../Event";
import { forwardRef, Ref } from "react";

interface Props {
    tidspunkt: Date;
    navKontor: string;
    url?: string;
}

const SendtEvent = ({ tidspunkt, navKontor, url }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.SendtEvent");
    return (
        <Event
            ref={ref}
            timestamp={tidspunkt}
            status="completed"
            title={t.rich("tittel", { norsk: (chunks) => <span lang="no">{chunks}</span>, navKontor })}
        >
            <Link href={url} className="text-ax-text-accent-subtle">
                {t("visSoknaden")}
            </Link>
        </Event>
    );
};

export default forwardRef(SendtEvent);
