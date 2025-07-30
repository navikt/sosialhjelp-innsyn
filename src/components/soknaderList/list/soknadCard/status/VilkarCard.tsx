import { useTranslations } from "next-intl";
import { CheckmarkIcon } from "@navikt/aksel-icons";

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
            href={`/soknad/${fiksDigisosId}`}
            description={t("description", { count: vedtakCount })}
            icon={<CheckmarkIcon />}
            variant="info"
        >
            <span lang="no">{sakTittel}</span>
        </StatusCard>
    );
};

export default VilkarCard;
