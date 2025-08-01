import { NotePencilDashIcon } from "@navikt/aksel-icons";
import { useLocale, useTranslations } from "next-intl";

import StatusCard from "@components/statusCard/StatusCard";
import { browserEnv } from "@config/env";

interface Props {
    soknadId: string;
    keptUntil: Date;
}

const PaabegyntCard = ({ soknadId, keptUntil }: Props) => {
    const t = useTranslations("StatusCard.PaabegyntCard");
    const locale = useLocale();
    return (
        <StatusCard
            href={`${browserEnv.NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/soknad/${locale}/skjema/${soknadId}/1`}
            description={t("description", { date: keptUntil })}
            icon={<NotePencilDashIcon />}
            variant="info"
            dashed
        >
            {t("title")}
        </StatusCard>
    );
};

export default PaabegyntCard;
