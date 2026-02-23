import { useTranslations } from "next-intl";

import Event from "./Event";
import { forwardRef, Ref } from "react";

interface Props {
    tidspunkt: Date;
    navKontor?: string;
}

const UnderBehandlingEvent = (props: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.UnderBehandlingEvent");

    return (
        <Event
            ref={ref}
            timestamp={props.tidspunkt}
            title={t.rich("tittel", {
                norsk: (chunks) => <span lang="no">{chunks}</span>,
                // TODO: Fiks oversettelse på default-verdien
                navKontor: props.navKontor ?? "ditt NAV-kontor",
            })}
        />
    );
};

export default forwardRef(UnderBehandlingEvent);
