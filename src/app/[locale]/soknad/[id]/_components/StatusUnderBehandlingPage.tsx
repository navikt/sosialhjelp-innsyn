import { getTranslations } from "next-intl/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { prefetchGetOppgaverBetaQuery } from "@generated/ssr/oppgave-controller/oppgave-controller";
import { getQueryClient } from "@api/queryClient";

import { StatusPage } from "./StatusPage";
import Oppgaver from "./oppgaver/Oppgaver";
import OppgaveAlert from "./oppgaver/OppgaveAlert";

interface Props {
    id: string;
}

export const StatusUnderBehandlingPage = async ({ id }: Props) => {
    const t = await getTranslations("StatusUnderBehandlingPage");

    const queryClient = getQueryClient();
    await prefetchGetOppgaverBetaQuery(queryClient, id);
    return (
        <StatusPage
            id={id}
            heading={t("tittel")}
            alert={
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <OppgaveAlert />
                </HydrationBoundary>
            }
        >
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Oppgaver />
            </HydrationBoundary>
        </StatusPage>
    );
};
