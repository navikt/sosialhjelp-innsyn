import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Skeleton } from "@navikt/ds-react";

import StatusAlert from "@components/alert/StatusAlert";
import { useGetOppgaverBetaSuspense } from "@generated/oppgave-controller/oppgave-controller";

const OppgaveAlert = () => {
    const { id } = useParams<{ id: string }>();
    const t = useTranslations("OppgaveAlert");
    const { data } = useGetOppgaverBetaSuspense(id);
    if (data.every((oppgave) => oppgave.erLastetOpp)) {
        return null;
    }
    return <StatusAlert variant="warning" tittel={t("tittel")} beskrivelse={t("beskrivelse")} />;
};

export const OppgaveAlertSkeleton = () => {
    return (
        <StatusAlert
            variant="info"
            tittel={<Skeleton width="100px" />}
            beskrivelse={<Skeleton width="400px" height="20px" />}
        />
    );
};

export default OppgaveAlert;
