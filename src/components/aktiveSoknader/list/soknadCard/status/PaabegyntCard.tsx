import { BodyShort } from "@navikt/ds-react";
import { NotePencilDashIcon } from "@navikt/aksel-icons";
import { getLocale, getTranslations } from "next-intl/server";

import StatusCard from "../../../statusCard/StatusCard";
import StatusIcon from "../icon/StatusIcon";
import { getServerEnv } from "../../../../../config/env";

interface Props {
    soknadId: string;
    keptUntil: Date;
}

const PaabegyntCard = async ({ soknadId, keptUntil }: Props) => {
    const t = await getTranslations("StatusCard.PaabegyntCard");
    const locale = await getLocale();
    return (
        <StatusCard
            href={`${getServerEnv().NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/soknad/${locale}/skjema/${soknadId}/1`}
            description={<BodyShort>{t("description", { date: keptUntil })}</BodyShort>}
            icon={<StatusIcon icon={NotePencilDashIcon} />}
            variant="info"
            dashed
        >
            {t("title")}
        </StatusCard>
    );
};

export default PaabegyntCard;
