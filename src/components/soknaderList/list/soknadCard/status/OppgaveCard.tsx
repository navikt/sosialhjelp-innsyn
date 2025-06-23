import { useTranslations } from "next-intl";
import { FilesIcon } from "@navikt/aksel-icons";

import StatusCard from "../../../statusCard/StatusCard";
import StatusIcon from "../icon/StatusIcon";

interface Props {
    fiksDigisosId: string;
    sakTittel?: string;
    frist?: string;
}

const OppgaveCard = ({ fiksDigisosId, sakTittel, frist }: Props) => {
    const t = useTranslations("StatusCard.OppgaveCard");
    return (
        <StatusCard
            href={`/soknader/${fiksDigisosId}`}
            description={frist ? t("description", { date: new Date(frist) }) : t("descriptionUtenFrist")}
            icon={<StatusIcon icon={FilesIcon} />}
            variant="warning"
        >
            <span lang="nb">{sakTittel}</span>
        </StatusCard>
    );
};

export default OppgaveCard;
