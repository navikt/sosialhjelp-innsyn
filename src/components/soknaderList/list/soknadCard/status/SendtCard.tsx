import { useTranslations } from "next-intl";
import { FileTextIcon } from "@navikt/aksel-icons";

import StatusCard from "../../../statusCard/StatusCard";

interface Props {
    fiksDigisosId: string;
    sendtDato: Date;
}

const SendtCard = ({ fiksDigisosId, sendtDato }: Props) => {
    const t = useTranslations("StatusCard.SendtCard");
    return (
        <StatusCard
            href={`/soknad/${fiksDigisosId}`}
            description={t("description", { date: sendtDato })}
            icon={<FileTextIcon />}
            variant="info"
        >
            {t("title")}
        </StatusCard>
    );
};

export default SendtCard;
