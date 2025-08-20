import { useTranslations } from "next-intl";
import { Heading, Skeleton, Tag, VStack } from "@navikt/ds-react";

import { SaksStatusResponse } from "@generated/model";
import { VilkarResponse } from "@generated/ssr/model";

import Sakstittel from "./Sakstittel";
import Vedtak from "./vedtak/Vedtak";
import VilkarListe from "./vilkar/VilkarListe";

interface Props {
    sak: SaksStatusResponse;
    vilkar: VilkarResponse[];
}

const Sak = ({ sak, vilkar }: Props) => (
    <VStack gap="16">
        <VStack gap="4">
            <Sakstittel tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} />
            {sak.utfallVedtak && <Vedtak vedtakUtfall={sak.utfallVedtak} vedtaksliste={sak.vedtaksfilUrlList} />}
        </VStack>
        {vilkar.length > 0 && <VilkarListe vilkar={vilkar} />}
    </VStack>
);

export const SakSkeleton = () => {
    const t = useTranslations("SakSkeleton");
    return (
        <VStack gap="2">
            <Heading size="large" level="2">
                {t("tittel")}
            </Heading>
            <Tag variant="info" className="self-start">
                <Skeleton width="50px" />
            </Tag>
        </VStack>
    );
};

export default Sak;
