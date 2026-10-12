import { Heading, InfoCard, VStack } from "@navikt/ds-react";
import { KlageRef, SaksStatusResponse } from "@generated/model";
import { useTranslations } from "next-intl";

import ExpandableList from "@components/showmore/ExpandableList";
import VedtakPanel from "./VedtakPanel";

interface Props {
    sak: SaksStatusResponse;
    klager?: KlageRef[];
    index: number;
}

const SakBlokk = ({ sak, klager, index }: Props) => {
    const t = useTranslations("SakBlokk");
    const headingId = `sak-${sak.referanse ?? index}-heading`;
    const vedtak = [...sak.vedtak].sort((a, b) => {
        const dateA = a.dato ? new Date(a.dato).getTime() : 0;
        const dateB = b.dato ? new Date(b.dato).getTime() : 0;
        return dateB - dateA;
    });

    return (
        <VStack gap="space-16">
            <Heading id={headingId} size="medium" level="2" lang="no">
                {sak.tittel}
            </Heading>
            {vedtak.length ? (
                <ExpandableList
                    as="ol"
                    items={vedtak}
                    itemsLimit={1}
                    id={`sak-${sak.referanse ?? index}-vedtak`}
                    labelledById={headingId}
                    showMoreSuffix={t("showMoreSuffix")}
                    gap="space-16"
                >
                    {(enkeltvedtak, ref) => (
                        <li key={enkeltvedtak.id} ref={ref} tabIndex={-1}>
                            <VedtakPanel
                                vedtak={enkeltvedtak}
                                innsendtKlage={klager?.find((klage) => klage.vedtakId === enkeltvedtak.id)}
                            />
                        </li>
                    )}
                </ExpandableList>
            ) : (
                <InfoCard data-color="info">
                    <InfoCard.Message icon={false}>{t("underBehandling")}</InfoCard.Message>
                </InfoCard>
            )}
        </VStack>
    );
};

export default SakBlokk;
