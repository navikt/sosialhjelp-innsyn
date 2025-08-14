"use client";

import { Alert, Heading, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { FilePdfIcon } from "@navikt/aksel-icons";

import { useHentForelopigSvarStatusSuspense } from "@generated/forelopig-svar-controller/forelopig-svar-controller";
import { useHentHendelserBetaSuspense } from "@generated/hendelse-controller/hendelse-controller";
import StatusCard from "@components/statusCard/StatusCard";

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

    const forelopig = hendelserData.find((hendelse) => hendelse.type === "ForelopigSvar");
    const navKontor = forelopig.navKontor ?? "";

    if (!forelopigData.harMottattForelopigSvar) {
        return null;
    }

    return (
        <VStack gap="space-32">
            <Alert variant="warning">
                <Heading size="small" level="2">
                    {t("tittel")}
                </Heading>
                {t.rich("beskrivelse", {
                    navKontor: navKontor,
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                })}
            </Alert>
            <VStack gap="space-16">
                <Heading size="large" level="2">
                    {t("tittel2")}
                </Heading>
                <StatusCard href={forelopigData.link} downloadIcon={true} icon={<FilePdfIcon />}>
                    {t("lenke")}
                </StatusCard>
            </VStack>
        </VStack>
    );
};
