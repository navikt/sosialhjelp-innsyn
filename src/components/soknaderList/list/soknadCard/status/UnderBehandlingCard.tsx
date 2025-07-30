import { useTranslations } from "next-intl";
import { PersonGavelIcon } from "@navikt/aksel-icons";

import StatusCard from "../../../statusCard/StatusCard";

interface Props {
    fiksDigisosId: string;
    sakTittel?: string;
}

const UnderBehandlingCard = ({ fiksDigisosId, sakTittel }: Props) => {
    const t = useTranslations("StatusCard.UnderBehandlingCard");
    return (
        <StatusCard
            href={`/soknad/${fiksDigisosId}`}
            description={t("description")}
            icon={<PersonGavelIcon />}
            variant="info"
        >
            <span lang="nb">{sakTittel}</span>
        </StatusCard>
    );
};

export default UnderBehandlingCard;
