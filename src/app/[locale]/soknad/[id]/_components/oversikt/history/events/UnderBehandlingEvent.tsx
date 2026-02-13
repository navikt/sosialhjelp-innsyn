import { useTranslations } from "next-intl";

import Event from "../Event";
import { forwardRef, Ref } from "react";
type Props =
    | {
          tidspunkt: Date;
          navKontor?: string;
          completed: true;
      }
    | { completed: false };

const UnderBehandlingEvent = (props: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.UnderBehandlingEvent");

    if (props.completed) {
        return (
            <Event
                ref={ref}
                timestamp={props.tidspunkt}
                status="completed"
                title={t.rich("completed.tittel", {
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                    // TODO: Fiks oversettelse på default-verdien
                    navKontor: props.navKontor ?? "ditt NAV-kontor",
                })}
            />
        );
    }

    return (
        <Event ref={ref} title={t("uncompleted.tittel")} status="uncompleted">
            {t("uncompleted.beskrivelse")}
        </Event>
    );
};

export default forwardRef(UnderBehandlingEvent);
