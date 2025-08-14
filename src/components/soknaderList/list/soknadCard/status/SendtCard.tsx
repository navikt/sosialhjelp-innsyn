import { useTranslations } from "next-intl";
import { FileTextIcon } from "@navikt/aksel-icons";

import StatusCard from "@components/soknaderList/list/soknadCard/status/StatusCard";

interface Props {
    fiksDigisosId: string;
    sendtDato: Date;
}

const SendtCard = ({ fiksDigisosId, sendtDato }: Props) => {
    const t = useTranslations("StatusCard.SendtCard");
    return (
        <StatusCard
            id={fiksDigisosId}
            description={t("description", { date: sendtDato })}
            icon={<FileTextIcon />}
            variant="info"
        >
            {t("title")}
        </StatusCard>
    );
};

export default SendtCard;
