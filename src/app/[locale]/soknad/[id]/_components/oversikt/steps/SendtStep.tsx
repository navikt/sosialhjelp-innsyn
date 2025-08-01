import { Link } from "@navikt/ds-react";
import { useFormatter, useTranslations } from "next-intl";

import Step from "./Step";

interface Props {
    tidspunkt: Date;
    navKontor: string;
    url?: string;
}

const SendtStep = ({ tidspunkt, navKontor, url }: Props) => {
    const t = useTranslations("OversiktSteps.SendtStep");
    const format = useFormatter();
    return (
        <Step heading={t.rich("tittel", { norsk: (chunks) => <span lang="no">{chunks}</span>, navKontor })} completed>
            <Link href={url} className="text-ax-text-accent-subtle">
                {t("visSoknaden")}
            </Link>
            {format.dateTime(tidspunkt, "long")}
        </Step>
    );
};

export default SendtStep;
