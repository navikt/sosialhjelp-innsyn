import React from "react";
import { useParams } from "next/navigation";
import { Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { KlageRef, SaksStatusResponse } from "@generated/model";
import { VilkarResponse } from "@generated/ssr/model";
import { useGetDokumentasjonkravBetaSuspense } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";

import Vedtak from "../vedtak/Vedtak";
import VilkarListe from "../vilkar/VilkarListe";
import Dokumentasjonkrav from "../dokumentasjonkrav/Dokumentasjonkrav";

import StatusTag from "./StatusTag";

interface Props {
    sak: SaksStatusResponse;
    vilkar: VilkarResponse[];
    innsendtKlage?: KlageRef;
}

const SingleSak = ({ sak, vilkar, innsendtKlage }: Props): React.JSX.Element | null => {
    const t = useTranslations("SingleSak");
    const { id } = useParams<{ id: string }>();
    const { data } = useGetDokumentasjonkravBetaSuspense(id);
    const dokumentasjonkrav = data.filter((it) => it.saksreferanse === sak.referanse);
    const vedtakUtfall = sak.utfallVedtak;
    if (!sak.utfallVedtak && vilkar.length === 0 && dokumentasjonkrav.length === 0) {
        return null;
    }
    return (
        <VStack gap="16">
            <VStack gap="4">
                {sak.utfallVedtak && (
                    <>
                        <Heading size="medium" level="2">
                            {t("vedtak")}
                        </Heading>
                        <StatusTag vedtakUtfall={vedtakUtfall} className="self-start" />
                        <Vedtak
                            vedtakUtfall={sak.utfallVedtak}
                            vedtaksliste={sak.vedtaksfilUrlList}
                            innsendtKlage={innsendtKlage}
                        />
                    </>
                )}
            </VStack>
            {vilkar.length > 0 && <VilkarListe vilkar={vilkar} />}
            {dokumentasjonkrav.length > 0 && <Dokumentasjonkrav dokumentasjonkrav={dokumentasjonkrav} />}
        </VStack>
    );
};

export default SingleSak;
