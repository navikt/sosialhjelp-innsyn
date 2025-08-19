import { getTranslations } from "next-intl/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Heading, Tag } from "@navikt/ds-react";
import { logger } from "@navikt/next-logger";

import { getQueryClient } from "@api/queryClient";
import { hentSaksStatuser } from "@generated/ssr/saks-status-controller/saks-status-controller";
import { getTranslationKeyForUtfall, isVedtakUtfallKey } from "@components/vedtak/VedtakUtfallMap";
import { VedtakUtfall } from "@components/vedtak/VedtakUtfall";
import { hentAlleSaker } from "@generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import fetchPaabegynteSaker from "@api/fetch/paabegynteSoknader/fetchPaabegynteSoknader";
import fetchSoknadsdetaljer from "@api/fetch/saksdetaljer/fetchSoknadsdetaljer";
import AlertWithCloseButton from "@components/alert/AlertWithCloseButton";

import OppgaveAlert from "./oppgaver/OppgaveAlert";
import Oppgaver from "./oppgaver/Oppgaver";
import { StatusPage } from "./StatusPage";

interface Props {
    id: string;
}

const fetchSaker = async () => {
    try {
        return hentAlleSaker();
    } catch (e: unknown) {
        logger.error(`Fikk feil under henting av alle saker. Feil: ${e}`);
        return [];
    }
};

export const StatusUnderBehandlingPage = async ({ id }: Props) => {
    const t = await getTranslations("StatusUnderBehandlingPage");

    const queryClient = getQueryClient();
    const saksData = await hentSaksStatuser(id);

    const [innsendteSoknader] = await Promise.all([fetchSaker(), fetchPaabegynteSaker()]);
    const soknadsdetaljer = await Promise.all(fetchSoknadsdetaljer(innsendteSoknader));
    const saker = soknadsdetaljer.find((sak) => sak.fiksDigisosId === id);

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
            {saker && saker.saker.length > 1 && (
                <AlertWithCloseButton variant="info">
                    <Heading size="small">{t("deltSøknad.tittel")}</Heading>
                    {t("deltSøknad.beskrivelse")}
                </AlertWithCloseButton>
            )}

            {saksData.map(async (sak, index) => {
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
                            <Heading size="large" level="2">
                                {t.rich("vedtakStatus", {
                                    sakstittel: sak.tittel,
                                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                                })}
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
