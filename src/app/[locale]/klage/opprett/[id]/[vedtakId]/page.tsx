import { BodyShort, Heading, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import React from "react";
import { getFlag, getToggles } from "@featuretoggles/unleash";
import ClientBreadcrumbs from "@components/breadcrumbs/ClientBreadcrumbs";

import KlageForm from "./_components/klageForm";

const Page = async ({ params }: { params: Promise<{ id: string; vedtakId: string }> }) => {
    const toggle = getFlag("sosialhjelp.innsyn.klage", await getToggles());
    if (!toggle.enabled) {
        return notFound();
    }

    const t = await getTranslations("OpprettKlagePage");
    const { id: fiksDigisosId, vedtakId } = await params;

    return (
        <VStack gap="16" className="mt-20">
            <ClientBreadcrumbs dynamicBreadcrumbs={[{ title: t("tittel") }]} />
            <VStack gap="4" className="mb-8">
                <Heading size="xlarge" level="1">
                    {t("tittel")}
                </Heading>
                <BodyShort>
                    {t.rich("navEnhet", {
                        norsk: (chunks) => <span lang="no">{chunks}</span>,
                        navKontor: t("ikkeOppgittNavEnhet"),
                    })}
                </BodyShort>
            </VStack>
            <KlageForm fiksDigisosId={fiksDigisosId} vedtakId={vedtakId} />
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
