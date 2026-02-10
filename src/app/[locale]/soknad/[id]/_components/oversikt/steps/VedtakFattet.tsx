import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@navikt/ds-react";

import Step from "./Step";

interface Props {
    tidspunkt: Date;
    url?: string;
    isNew: boolean;
}

const VedtakFattet = (props: Props) => {
    const t = useTranslations("OversiktSteps.VedtakFattet");
    const format = useFormatter();
    return (
        <Step heading={t("tittel", { nytt: props.isNew ? "true" : "false" })} completed>
            <Link href={props.url} className="text-ax-text-accent-subtle">
                {t("visVedtaket")}
            </Link>
            {format.dateTime(props.tidspunkt, "long")}
        </Step>
    );
};

export default VedtakFattet;
