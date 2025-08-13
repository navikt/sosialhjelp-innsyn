import { getTranslations } from "next-intl/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Heading, Tag } from "@navikt/ds-react";

import { getQueryClient } from "@api/queryClient";
import { hentSaksStatuser } from "@generated/ssr/saks-status-controller/saks-status-controller";
import { isVedtakUtfallKey, vedtakUtfallMap } from "@components/vedtak/VedtakUtfallMap";

import { StatusPage } from "./StatusPage";
import Oppgaver from "./oppgaver/Oppgaver";
import OppgaveAlert from "./oppgaver/OppgaveAlert";

interface Props {
    id: string;
}

export const StatusUnderBehandlingPage = async ({ id }: Props) => {
    const t = await getTranslations("StatusUnderBehandlingPage");

    const queryClient = getQueryClient();
    const saker = await hentSaksStatuser(id);

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
            {saker.map((sak, index) => {
                const key = sak.utfallVedtak;
                const Component = key && isVedtakUtfallKey(key) ? vedtakUtfallMap[key] : null;

                if (Component) {
                    return <Component key={index} sak={sak} />;
                }

                if (sak.status === "UNDER_BEHANDLING") {
                    return (
                        <div key={index}>
                            <Heading size="xlarge" level="1">
                                {sak.tittel}
                            </Heading>
                            <Tag variant="info-moderate" key={index}>
                                {t("underBehandlingAlert")}
                            </Tag>
                        </div>
                    );
                }
                return null;
            })}
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Oppgaver />
            </HydrationBoundary>
        </StatusPage>
    );
};
