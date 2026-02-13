import { useTranslations } from "next-intl";
import { Link } from "@navikt/ds-react";

import Event from "../Event";
import { forwardRef, Ref } from "react";

interface Props {
    tidspunkt: Date;
    url?: string;
    isNew: boolean;
}

const VedtakFattetEvent = (props: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.VedtakFattetEvent");

    return (
        <Event
            ref={ref}
            title={t("tittel", { nytt: props.isNew ? "true" : "false" })}
            status="completed"
            timestamp={props.tidspunkt}
        >
            <Link href={props.url} className="text-ax-text-accent-subtle">
                {t("visVedtaket")}
            </Link>
        </Event>
    );
};

export default forwardRef(VedtakFattetEvent);
