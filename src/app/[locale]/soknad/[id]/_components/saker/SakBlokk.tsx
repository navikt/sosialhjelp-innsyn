import { Heading, VStack } from "@navikt/ds-react";
import { KlageRef, SaksStatusResponse } from "@generated/model";
import { useTranslations } from "next-intl";

import ExpandableList from "@components/showmore/ExpandableList";
import VedtakPanel from "./VedtakPanel";
import SakStatusInfo from "./SakStatusInfo";
import { sortVedtak } from "./sort";

interface Props {
    sak: SaksStatusResponse;
    klager?: KlageRef[];
    index: number;
}

const SakBlokk = ({ sak, klager, index }: Props) => {
    const t = useTranslations("SakBlokk");
    const headingId = `sak-${sak.referanse ?? index}-heading`;
    const vedtak = sortVedtak(sak.vedtak);

    return (
        <VStack gap="space-4">
            <Heading id={headingId} size="medium" level="2" lang="no">
                {sak.tittel}
            </Heading>
            {vedtak.length > 0 && (
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
            )}
            <SakStatusInfo status={sak.status} harVedtak={vedtak.length > 0} />
        </VStack>
    );
};

export default SakBlokk;
