import { Heading, VStack } from "@navikt/ds-react";
import { KlageRef, SaksStatusResponse } from "@generated/model";
import { useTranslations } from "next-intl";

import VedtakListe from "./VedtakListe";
import { sortVedtak } from "./sort";

interface Props {
    sak: SaksStatusResponse;
    klager?: KlageRef[];
}

const SingleSak = ({ sak, klager }: Props) => {
    const t = useTranslations("VedtakListe");
    const vedtak = sortVedtak(sak.vedtak);

    if (!vedtak.length) {
        return null;
    }

    return (
        <VStack gap="space-16">
            <Heading id="vedtak-heading" size="medium" level="2">
                {t("vedtak")}
            </Heading>
            <VedtakListe
                vedtak={vedtak}
                klager={klager}
                id="vedtak-liste"
                labelledById="vedtak-heading"
                showMoreSuffix={t("showMoreSuffix")}
            />
        </VStack>
    );
};

export default SingleSak;
