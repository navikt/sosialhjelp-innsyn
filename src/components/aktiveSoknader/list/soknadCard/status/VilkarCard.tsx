import { useTranslations } from "next-intl";
import { CheckmarkIcon } from "@navikt/aksel-icons";

import StatusIcon from "../icon/StatusIcon";
import StatusCard from "../../../statusCard/StatusCard";

interface Props {
    sakTittel: string;
    fiksDigisosId: string;
    vedtakCount: number;
}

const VilkarCard = ({ fiksDigisosId, sakTittel, vedtakCount }: Props) => {
    const t = useTranslations("StatusCard.VilkarCard");
    return (
        <StatusCard
            href={`/soknader/${fiksDigisosId}`}
            description={t("description", { count: vedtakCount })}
            icon={<StatusIcon icon={CheckmarkIcon} />}
            variant="info"
        >
            <span lang="no">{sakTittel}</span>
        </StatusCard>
    );
};

export default VilkarCard;
