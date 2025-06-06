import { BodyShort } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { PersonGavelIcon } from "@navikt/aksel-icons";

import StatusCard from "../../../statusCard/StatusCard";
import StatusIcon from "../icon/StatusIcon";

interface Props {
    fiksDigisosId: string;
    sakTittel?: string;
}

const UnderBehandlingCard = ({ fiksDigisosId, sakTittel }: Props) => {
    const t = useTranslations("StatusCard.UnderBehandlingCard");
    return (
        <StatusCard
            href={`/soknader/${fiksDigisosId}`}
            description={<BodyShort lang="nb">{sakTittel}</BodyShort>}
            icon={<StatusIcon icon={PersonGavelIcon} />}
            variant="info"
        >
            {t("title")}
        </StatusCard>
    );
};

export default UnderBehandlingCard;
