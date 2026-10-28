"use client";

import { Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { EnvelopeClosedIcon } from "@navikt/aksel-icons";
import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { useParams } from "next/navigation";
import { useHentBrevSuspense } from "@generated/brev-controller/brev-controller";
import { SoknadsStatusResponseStatus } from "@generated/model";
import useFocusRef from "@hooks/useFocusRef";

const BrevFraNav = () => {
    const { id } = useParams<{ id: string }>();
    const t = useTranslations("BrevFraNav");
    const { data: brev } = useHentBrevSuspense(id);
    const ref = useFocusRef<HTMLAnchorElement>("#forlenget-saksbehandlingstid");

    if (brev.length === 0) {
        return null;
    }

    return (
        <VStack gap="space-8" id="brev-fra-nav" as="section">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <VStack gap="space-8" as="ol">
                {brev.map((br, index) => (
                    <li key={`${br.type}-${br.timestamp}-${index}`}>
                        <DigisosLinkCard
                            href={br.url}
                            ref={br.type === "FORELOPIG_SVAR" ? ref : undefined}
                            cardIcon="external-link"
                            openInNewTab
                            icon={<EnvelopeClosedIcon aria-hidden />}
                            description={br.timestamp ? t("mottatt", { dato: new Date(br.timestamp) }) : undefined}
                        >
                            {t(br.type)}
                        </DigisosLinkCard>
                    </li>
                ))}
            </VStack>
        </VStack>
    );
};

export const BrevFraNavSkeleton = ({ soknadStatus }: { soknadStatus: SoknadsStatusResponseStatus }) => {
    const t = useTranslations("BrevFraNav");
    if (soknadStatus === "MOTTATT" || soknadStatus === "SENDT") {
        return null;
    }
    return (
        <VStack gap="space-8" id="brev-fra-nav">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
        </VStack>
    );
};

export default BrevFraNav;
