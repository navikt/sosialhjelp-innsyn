import { BodyShort } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { FilesIcon } from "@navikt/aksel-icons";

import StatusCard from "../../../statusCard/StatusCard";
import StatusIcon from "../icon/StatusIcon";

interface Props {
    fiksDigisosId: string;
    sakTittel?: string;
}

const OppgaveCard = ({ fiksDigisosId, sakTittel }: Props) => {
    const t = useTranslations("StatusCard.OppgaveCard");
    return (
        <StatusCard
            href={`/soknader/${fiksDigisosId}`}
            description={<BodyShort lang="nb">{sakTittel}</BodyShort>}
            icon={<StatusIcon icon={FilesIcon} />}
            variant="warning"
        >
            {t("title")}
        </StatusCard>
    );
};

export default OppgaveCard;
