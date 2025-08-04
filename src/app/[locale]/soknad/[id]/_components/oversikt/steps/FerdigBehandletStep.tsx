import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@navikt/ds-react";

import Step from "./Step";

type Props =
    | {
          tidspunkt: Date;
          url?: string;
          completed: true;
      }
    | { completed: false };

const FerdigBehandletStep = (props: Props) => {
    const t = useTranslations("OversiktSteps.FerdigBehandletStep");
    const format = useFormatter();
    if (props.completed) {
        return (
            <Step heading={t("tittel")} completed>
                <Link href={props.url} className="text-ax-text-accent-subtle">
                    {t("completed.visVedtaket")}
                </Link>
                {format.dateTime(props.tidspunkt, "long")}
            </Step>
        );
    }
    return <Step heading={t("tittel")}>{t("uncompleted.beskrivelse")}</Step>;
};

export default FerdigBehandletStep;
