import { useTranslations } from "next-intl";
import { FileTextIcon } from "@navikt/aksel-icons";

import StatusCard from "@components/soknaderList/list/soknadCard/status/StatusCard";

interface Props {
    fiksDigisosId: string;
    mottattDato: Date;
}

const MottattCard = ({ fiksDigisosId, mottattDato }: Props) => {
    const t = useTranslations("StatusCard.MottattCard");
    return (
        <StatusCard
            id={fiksDigisosId}
            description={t("description", { date: mottattDato })}
            icon={<FileTextIcon />}
            variant="info"
        >
            {t("title")}
        </StatusCard>
    );
};

export default MottattCard;
