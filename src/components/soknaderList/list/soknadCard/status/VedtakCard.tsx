import { useTranslations } from "next-intl";
import { CheckmarkCircleIcon } from "@navikt/aksel-icons";

import StatusCard from "../../../statusCard/StatusCard";

interface Props {
    sakTittel: string;
    fiksDigisosId: string;
    vedtakCount: number;
}

const VedtakCard = ({ fiksDigisosId, sakTittel, vedtakCount }: Props) => {
    const t = useTranslations("StatusCard.VedtakCard");
    return (
        <StatusCard
            href={`/soknad/${fiksDigisosId}`}
            description={t("description", { count: vedtakCount })}
            icon={<CheckmarkCircleIcon />}
            variant="info"
        >
            <span lang="nb">{sakTittel}</span>
        </StatusCard>
    );
};

export default VedtakCard;
