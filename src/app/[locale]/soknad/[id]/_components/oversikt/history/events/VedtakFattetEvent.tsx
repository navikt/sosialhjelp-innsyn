import { useTranslations } from "next-intl";

import Event from "./Event";
import { forwardRef, Ref } from "react";

interface Props {
    tidspunkt: Date;
    isNew: boolean;
    sakstittel?: string;
}

const VedtakFattetEvent = ({ tidspunkt, isNew, sakstittel }: Props, ref: Ref<HTMLLIElement>) => {
    const t = useTranslations("History.VedtakFattetEvent");

    if (sakstittel && !isNew) {
        return (
            <Event
                ref={ref}
                title={t.rich("withSakstittel.tittel", {
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                    sakstittel,
                })}
                timestamp={tidspunkt}
            />
        );
    }

    return <Event ref={ref} title={t("tittel", { nytt: isNew ? "true" : "false" })} timestamp={tidspunkt} />;
};

export default forwardRef(VedtakFattetEvent);
