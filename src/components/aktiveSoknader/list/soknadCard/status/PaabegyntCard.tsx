import { BodyShort } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { NotePencilDashIcon } from "@navikt/aksel-icons";

import StatusCard from "../../../statusCard/StatusCard";
import StatusIcon from "../icon/StatusIcon";

interface Props {
    fiksDigisosId: string;
    keptUntil: Date;
}

const PaabegyntCard = ({ fiksDigisosId, keptUntil }: Props) => {
    const t = useTranslations("StatusCard.PaabegyntCard");
    return (
        <StatusCard
            href={`/soknader/${fiksDigisosId}`}
            description={<BodyShort>{t("description", { date: keptUntil })}</BodyShort>}
            icon={<StatusIcon icon={NotePencilDashIcon} />}
            variant="info"
        >
            {t("title")}
        </StatusCard>
    );
};

export default PaabegyntCard;
