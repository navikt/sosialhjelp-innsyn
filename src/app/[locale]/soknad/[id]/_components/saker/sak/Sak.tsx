import { VStack } from "@navikt/ds-react";
import { useParams } from "next/navigation";

import { KlageRef, SaksStatusResponse } from "@generated/model";
import { VilkarResponse } from "@generated/ssr/model";
import { useGetDokumentasjonkravBetaSuspense } from "@generated/oppgave-controller/oppgave-controller";

import Vedtak from "../vedtak/Vedtak";
import VilkarListe from "../vilkar/VilkarListe";
import Dokumentasjonkrav from "../dokumentasjonkrav/Dokumentasjonkrav";

import Sakstittel from "./Sakstittel";

interface Props {
    sak: SaksStatusResponse;
    vilkar: VilkarResponse[];
    innsendtKlage?: KlageRef;
}

const Sak = ({ sak, vilkar, innsendtKlage }: Props) => {
    const { id } = useParams<{ id: string }>();

    const { data } = useGetDokumentasjonkravBetaSuspense(id);
    const dokumentasjonkrav = data.filter((it) => it.saksreferanse === sak.referanse);
    if (!sak.utfallVedtak && vilkar.length === 0 && dokumentasjonkrav.length === 0) {
        return null;
    }
    return (
        <VStack gap="16">
            <VStack gap="4">
                <Sakstittel tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} />
                {sak.utfallVedtak && (
                    <Vedtak
                        vedtakUtfall={sak.utfallVedtak}
                        vedtaksliste={sak.vedtaksfilUrlList}
                        innsendtKlage={innsendtKlage}
                    />
                )}
            </VStack>
            {vilkar.length > 0 && <VilkarListe vilkar={vilkar} />}
            {dokumentasjonkrav.length > 0 && <Dokumentasjonkrav dokumentasjonkrav={dokumentasjonkrav} />}
        </VStack>
    );
};

export default Sak;
