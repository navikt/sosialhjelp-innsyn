import { BodyShort } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { FileTextIcon } from "@navikt/aksel-icons";

import StatusCard from "../../../statusCard/StatusCard";
import StatusIcon from "../icon/StatusIcon";

interface Props {
    fiksDigisosId: string;
    sendtDato: Date;
}

const SendtCard = ({ fiksDigisosId, sendtDato }: Props) => {
    const t = useTranslations("StatusCard.SendtCard");
    return (
        <StatusCard
            href={`/soknader/${fiksDigisosId}`}
            description={t("description", { date: sendtDato })}
            icon={<StatusIcon icon={FileTextIcon} />}
            variant="info"
        >
            {t("title")}
        </StatusCard>
    );
};

export default SendtCard;
