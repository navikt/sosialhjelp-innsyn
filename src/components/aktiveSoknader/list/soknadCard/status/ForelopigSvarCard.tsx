import { BodyShort } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { EnvelopeClosedIcon } from "@navikt/aksel-icons";

import StatusCard from "../../../statusCard/StatusCard";
import StatusIcon from "../icon/StatusIcon";

interface Props {
    fiksDigisosId: string;
    sakTittel?: string;
}

const ForelopigSvarCard = ({ fiksDigisosId, sakTittel }: Props) => {
    const t = useTranslations("StatusCard.ForelopigSvarCard");
    return (
        <StatusCard
            href={`/soknader/${fiksDigisosId}`}
            description={<span lang="nb">{sakTittel}</span>}
            icon={<StatusIcon icon={EnvelopeClosedIcon} />}
            variant="info"
        >
            {t("title")}
        </StatusCard>
    );
};

export default ForelopigSvarCard;
