import { BodyShort } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { FileTextIcon } from "@navikt/aksel-icons";

import StatusCard from "../../../statusCard/StatusCard";
import StatusIcon from "../icon/StatusIcon";

interface Props {
    fiksDigisosId: string;
    mottattDato: Date;
}

const MottattCard = ({ fiksDigisosId, mottattDato }: Props) => {
    const t = useTranslations("StatusCard.MottattCard");
    return (
        <StatusCard
            href={`/soknader/${fiksDigisosId}`}
            description={<BodyShort>{t("description", { date: mottattDato })}</BodyShort>}
            icon={<StatusIcon icon={FileTextIcon} />}
            variant="info"
        >
            {t("title")}
        </StatusCard>
    );
};

export default MottattCard;
