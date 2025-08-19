"use client";

import { Alert, Heading, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FilePdfIcon } from "@navikt/aksel-icons";

import { useHentForelopigSvarStatusSuspense } from "@generated/forelopig-svar-controller/forelopig-svar-controller";
import { useHentHendelserBetaSuspense } from "@generated/hendelse-controller/hendelse-controller";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";

export const ForelopigSvarAlertSkeleton = () => {
    return (
        <VStack gap="2">
            <Skeleton variant="rounded" width="100%" height={40} />
        </VStack>
    );
};

export const ForelopigSvarAlert = () => {
    const t = useTranslations("StatusForelopigSvar");
    const { id } = useParams<{ id: string }>();
    const { data: forelopigData } = useHentForelopigSvarStatusSuspense(id);
    const { data: hendelserData } = useHentHendelserBetaSuspense(id);

    if (!forelopigData) {
        return null;
    }

    const forelopig = hendelserData && hendelserData.find((hendelse) => hendelse.type === "ForelopigSvar");
    return (
        <VStack gap="space-32">
            <Alert variant="warning">
                <Heading size="small" level="2">
                    {t("tittel")}
                </Heading>
                {t.rich("beskrivelse", {
                    navKontor: forelopig?.navKontor ?? "Nav-kontoret ditt",
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                })}
            </Alert>
            <VStack gap="space-16">
                <Heading size="large" level="2">
                    {t("tittel2")}
                </Heading>
                {forelopigData.link && (
                    <DigisosLinkCard href={forelopigData.link} downloadIcon={true} icon={<FilePdfIcon />}>
                        {t("lenke")}
                    </DigisosLinkCard>
                )}
            </VStack>
        </VStack>
    );
};
