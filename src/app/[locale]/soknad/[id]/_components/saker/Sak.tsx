import { useTranslations } from "next-intl";
import { Heading, Skeleton, Tag, VStack } from "@navikt/ds-react";

import { SaksStatusResponse } from "@generated/model";

import Sakstittel from "./Sakstittel";
import Vedtak from "./vedtak/Vedtak";

interface Props {
    sak: SaksStatusResponse;
}

const Sak = ({ sak }: Props) => (
    <VStack gap="2">
        <Sakstittel tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} />
        {sak.utfallVedtak && <Vedtak vedtakUtfall={sak.utfallVedtak} vedtaksliste={sak.vedtaksfilUrlList} />}
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
