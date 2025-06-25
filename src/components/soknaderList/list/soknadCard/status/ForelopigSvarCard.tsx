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
            href={`/soknad/${fiksDigisosId}`}
            description={t("description")}
            icon={<StatusIcon icon={EnvelopeClosedIcon} />}
            variant="info"
        >
            <span lang="nb">{sakTittel}</span>
        </StatusCard>
    );
};

export default ForelopigSvarCard;
