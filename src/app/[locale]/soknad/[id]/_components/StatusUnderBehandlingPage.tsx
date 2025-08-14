import { getTranslations } from "next-intl/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Heading, Tag } from "@navikt/ds-react";

import { getQueryClient } from "@api/queryClient";
import { hentSaksStatuser } from "@generated/ssr/saks-status-controller/saks-status-controller";
import { getTranslationKeyForUtfall, isVedtakUtfallKey } from "@components/vedtak/VedtakUtfallMap";
import { VedtakUtfall } from "@components/vedtak/VedtakUtfall";

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
            {saker.map(async (sak, index) => {
                const key = sak.utfallVedtak;
                if (key && isVedtakUtfallKey(key)) {
                    const utfallKey = getTranslationKeyForUtfall(key);
                    const utfallTranslations = await getTranslations(utfallKey);
                    return (
                        <VedtakUtfall
                            key={index}
                            tittel={sak.tittel}
                            beskrivelse={utfallTranslations("beskrivelse")}
                            vedtaksfilUrlList={sak.vedtaksfilUrlList}
                            utfallVedtak={sak.utfallVedtak}
                            utfallVedtakStatus={utfallTranslations("tittel")}
                        />
                    );
                }

                if (sak.status === "UNDER_BEHANDLING") {
                    return (
                        <div key={index}>
                            <Heading size="xlarge" level="2">
                                {sak.tittel} dsa
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
