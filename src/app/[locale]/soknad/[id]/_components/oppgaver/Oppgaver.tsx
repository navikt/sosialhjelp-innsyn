"use client";

import { Alert, Heading, Skeleton, VStack } from "@navikt/ds-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useGetOppgaverBetaSuspense } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import useIkkeInnsyn from "@hooks/useIkkeInnsyn";
import { useGetSaksDetaljerSuspense } from "@generated/saks-oversikt-controller/saks-oversikt-controller";
import SoknadsoppgaverSection from "./soknadsoppgaver/SoknadsoppgaverSection";
import InnsynsoppgaverSection from "./InnsynsoppgaverSection";

const Oppgaver = () => {
    const { id } = useParams<{ id: string }>();
    // Kommer sortert på lastetOpp og deretter frist
    const { data: oppgaver, isFetching } = useGetOppgaverBetaSuspense(id);
    const { data: soknad } = useGetSaksDetaljerSuspense(id);
    const ikkeInnsyn = useIkkeInnsyn(soknad);

    if (oppgaver.length === 0 || ikkeInnsyn) {
        return null;
    }

    const isAllOppgaverFromSoknad = oppgaver.every((oppgave) => !oppgave.erFraInnsyn);

    if (isAllOppgaverFromSoknad) {
        return <SoknadsoppgaverSection oppgaver={oppgaver} isFetching={isFetching} />;
    }

    return <InnsynsoppgaverSection oppgaver={oppgaver} isFetching={isFetching} />;
};

export const OppgaverSkeleton = () => {
    const t = useTranslations("OppgaverSkeleton");
    return (
        <VStack gap="space-16">
            <Heading size="medium" level="2" spacing>
                {t("tittel")}
            </Heading>
            <Alert variant="info">
                <Heading level="3" size="medium">
                    <Skeleton width="100px" />
                </Heading>
                <Skeleton width="400px" height="20px" />
            </Alert>
        </VStack>
    );
};

export default Oppgaver;
