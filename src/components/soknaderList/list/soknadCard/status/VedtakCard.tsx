import { useTranslations } from "next-intl";
import { CheckmarkCircleIcon } from "@navikt/aksel-icons";

import StatusCard from "@components/soknaderList/list/soknadCard/status/StatusCard";

interface Props {
    sakTittel: string;
    fiksDigisosId: string;
    vedtakCount: number;
}

const VedtakCard = ({ fiksDigisosId, sakTittel, vedtakCount }: Props) => {
    const t = useTranslations("StatusCard.VedtakCard");
    return (
        <StatusCard
            id={fiksDigisosId}
            description={t("description", { count: vedtakCount })}
            icon={<CheckmarkCircleIcon />}
            variant="info"
        >
            <span lang="nb">{sakTittel}</span>
        </StatusCard>
    );
};

export default VedtakCard;
