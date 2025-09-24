import { Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getFlag, getToggles } from "@featuretoggles/unleash";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";
import { getQueryClient } from "@api/queryClient";
import { prefetchHentSakForVedtakQuery } from "@generated/ssr/sak-controller/sak-controller";

import KlageForm from "./_components/klageForm";
import KlageVedtak from "./_components/KlageVedtak";

const Page = async ({ params }: { params: Promise<{ id: string; vedtakId: string }> }) => {
    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
    if (!toggle.enabled) {
        return notFound();
    }

    const t = await getTranslations("OpprettKlagePage");
    const { id: fiksDigisosId, vedtakId } = await params;

    const queryClient = getQueryClient();
    await prefetchHentSakForVedtakQuery(queryClient, fiksDigisosId, vedtakId);

    return (
        <VStack gap="16" className="mt-20">
            <ClientBreadcrumbs dynamicBreadcrumbs={[{ title: t("tittel") }]} />
            <Heading size="xlarge" level="1">
                {t("tittel")}
            </Heading>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <KlageVedtak fiksDigisosId={fiksDigisosId} vedtakId={vedtakId} />
                <KlageForm fiksDigisosId={fiksDigisosId} vedtakId={vedtakId} />
            </HydrationBoundary>
        </VStack>
    );
};

export const generateMetadata = async () => {
    const t = await getTranslations("OpprettKlagePage");
    return {
        title: t("tittel"),
        description: t("beskrivelse"),
    };
};

export default Page;
