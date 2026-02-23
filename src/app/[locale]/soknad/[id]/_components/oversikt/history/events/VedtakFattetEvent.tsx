import { useTranslations } from "next-intl";
import { Link } from "@navikt/ds-react";

import Event from "../Event";
import { forwardRef, Ref } from "react";

interface Props {
    tidspunkt: Date;
    url?: string;
    isNew: boolean;
    sakstittel?: string;
}

const VedtakFattetEvent = ({ tidspunkt, isNew, url, sakstittel }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.VedtakFattetEvent");

    if (sakstittel && !isNew) {
        return (
            <Event
                ref={ref}
                title={t.rich("withSakstittel.tittel", {
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                    sakstittel,
                })}
                status="completed"
                timestamp={tidspunkt}
            >
                <Link href={url} className="text-ax-text-accent-subtle">
                    {t("visVedtaket")}
                </Link>
            </Event>
        );
    }

    return (
        <Event
            ref={ref}
            title={t("tittel", { nytt: isNew ? "true" : "false" })}
            status="completed"
            timestamp={tidspunkt}
        >
            <Link href={url} className="text-ax-text-accent-subtle">
                {t("visVedtaket")}
            </Link>
        </Event>
    );
};

export default forwardRef(VedtakFattetEvent);
