import { Heading, VStack } from "@navikt/ds-react";
import { KlageRef, SaksStatusResponse } from "@generated/model";
import { useTranslations } from "next-intl";

import SakStatusInfo from "./SakStatusInfo";
import VedtakListe from "./VedtakListe";
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
            <VedtakListe
                vedtak={vedtak}
                klager={klager}
                id={`sak-${sak.referanse ?? index}-vedtak`}
                labelledById={headingId}
                showMoreSuffix={t("showMoreSuffix")}
            />
            <SakStatusInfo status={sak.status} harVedtak={vedtak.length > 0} />
        </VStack>
    );
};

export default SakBlokk;
