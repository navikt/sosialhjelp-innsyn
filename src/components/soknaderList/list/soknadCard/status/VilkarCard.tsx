import { useTranslations } from "next-intl";
import { CheckmarkIcon } from "@navikt/aksel-icons";

import StatusCard from "@components/soknaderList/list/soknadCard/status/StatusCard";

interface Props {
    sakTittel: string;
    fiksDigisosId: string;
    vedtakCount: number;
}

const VilkarCard = ({ fiksDigisosId, sakTittel, vedtakCount }: Props) => {
    const t = useTranslations("StatusCard.VilkarCard");
    return (
        <StatusCard
            id={fiksDigisosId}
            description={t("description", { count: vedtakCount })}
            icon={<CheckmarkIcon />}
            variant="info"
        >
            <span lang="no">{sakTittel}</span>
        </StatusCard>
    );
};

export default VilkarCard;
