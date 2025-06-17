import { useTranslations } from "next-intl";
import { BodyShort } from "@navikt/ds-react";
import { CheckmarkCircleIcon } from "@navikt/aksel-icons";

import StatusIcon from "../icon/StatusIcon";
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
            href={`/soknader/${fiksDigisosId}`}
            description={t.rich("description", {
                norsk: (chunks) => <span lang="no">{chunks}</span>,
                tittel: sakTittel,
            })}
            icon={<StatusIcon icon={CheckmarkCircleIcon} />}
            variant="info"
        >
            {t("title", { count: vedtakCount })}
        </StatusCard>
    );
};

export default VedtakCard;
