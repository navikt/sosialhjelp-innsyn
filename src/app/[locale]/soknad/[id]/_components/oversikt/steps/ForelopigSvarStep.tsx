import { useFormatter, useTranslations } from "next-intl";

import Step from "./Step";

interface Props {
    tidspunkt: Date;
    navKontor: string;
}

const ForelopigSvarStep = ({ tidspunkt, navKontor }: Props) => {
    const t = useTranslations("OversiktSteps.ForelopigSvarStep");
    const format = useFormatter();
    return (
        <Step heading={t.rich("tittel", { norsk: (chunks) => <span lang="no">{chunks}</span>, navKontor })} completed>
            {format.dateTime(tidspunkt, "long")}
        </Step>
    );
};

export default ForelopigSvarStep;
