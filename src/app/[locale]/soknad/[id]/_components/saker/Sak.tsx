import { useTranslations } from "next-intl";
import { Heading, Skeleton, Tag, VStack } from "@navikt/ds-react";
import { useParams } from "next/navigation";

import { SaksStatusResponse } from "@generated/model";
import { VilkarResponse } from "@generated/ssr/model";
import { useGetDokumentasjonkravBetaSuspense } from "@generated/oppgave-controller/oppgave-controller";

import Sakstittel from "./Sakstittel";
import Vedtak from "./vedtak/Vedtak";
import VilkarListe from "./vilkar/VilkarListe";
import Dokumentasjonkrav from "./dokumentasjonkrav/Dokumentasjonkrav";

interface Props {
    sak: SaksStatusResponse;
    vilkar: VilkarResponse[];
}

const Sak = ({ sak, vilkar }: Props) => {
    const { id } = useParams<{ id: string }>();

    const { data } = useGetDokumentasjonkravBetaSuspense(id);
    const dokumentasjonkrav = data.filter((it) => it.saksreferanse === sak.referanse);
    return (
        <VStack gap="16">
            <VStack gap="4">
                <Sakstittel tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} />
                {sak.utfallVedtak && <Vedtak vedtakUtfall={sak.utfallVedtak} vedtaksliste={sak.vedtaksfilUrlList} />}
            </VStack>
            {vilkar.length > 0 && <VilkarListe vilkar={vilkar} />}
            {dokumentasjonkrav.length > 0 && <Dokumentasjonkrav dokumentasjonkrav={dokumentasjonkrav} />}
        </VStack>
    );
};

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
