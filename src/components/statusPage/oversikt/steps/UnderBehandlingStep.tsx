import { useFormatter, useTranslations } from "next-intl";

import Step from "./Step";

type Props =
    | {
          tidspunkt: Date;
          navKontor?: string;
          completed: true;
      }
    | { completed: false };

const UnderBehandlingStep = (props: Props) => {
    const t = useTranslations("OversiktSteps.UnderBehandlingStep");
    const format = useFormatter();
    if (props.completed) {
        return (
            <Step
                heading={t.rich("completed.tittel", {
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                    // TODO: Fiks oversettelse på default-verdien
                    navKontor: props.navKontor ?? "ditt NAV-kontor",
                })}
                completed
            >
                {format.dateTime(props.tidspunkt, "long")}
            </Step>
        );
    }
    return <Step heading={t("uncompleted.tittel")}>{t("uncompleted.beskrivelse")}</Step>;
};

export default UnderBehandlingStep;
