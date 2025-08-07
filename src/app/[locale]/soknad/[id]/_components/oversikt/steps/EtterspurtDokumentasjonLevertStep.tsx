import { useFormatter, useTranslations } from "next-intl";

import Step from "./Step";

interface Props {
    tidspunkt: Date;
}

const EtterspurtDokumentasjonLevertStep = ({ tidspunkt }: Props) => {
    const t = useTranslations("OversiktSteps.EtterspurtDokumentasjonLevertStep");
    const format = useFormatter();
    return (
        <Step heading={t("tittel")} completed>
            {format.dateTime(tidspunkt, "long")}
        </Step>
    );
};

export default EtterspurtDokumentasjonLevertStep;
