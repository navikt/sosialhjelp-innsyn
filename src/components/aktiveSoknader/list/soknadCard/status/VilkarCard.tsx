import { useTranslations } from "next-intl";
import { BodyShort } from "@navikt/ds-react";
import { CheckmarkIcon } from "@navikt/aksel-icons";

import StatusIcon from "../icon/StatusIcon";
import StatusCard from "../../../statusCard/StatusCard";

interface Props {
    sakTittel: string;
    fiksDigisosId: string;
    vedtakCount?: number;
}

const VilkarCard = ({ fiksDigisosId, sakTittel, vedtakCount }: Props) => {
    const t = useTranslations("StatusCard.VilkarCard");
    return (
        <StatusCard
            href={`/soknader/${fiksDigisosId}`}
            description={
                <BodyShort lang="nb">
                    {t.rich("description", { norsk: (chunks) => <span lang="no">{chunks}</span>, tittel: sakTittel })}
                </BodyShort>
            }
            icon={<StatusIcon icon={CheckmarkIcon} />}
            variant="info"
        >
            {t("title", { count: vedtakCount ?? 1 })}
        </StatusCard>
    );
};

export default VilkarCard;
