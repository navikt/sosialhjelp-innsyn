import React from "react";
import Vedtak from "./Vedtak";
import { BoxNew, VStack } from "@navikt/ds-react";
import KlageInfo from "./KlageInfo";
import { SaksStatusResponse } from "@generated/model";
import Sakstittel from "../Sakstittel";
import { useHentKlagerSuspense } from "@generated/klage-controller/klage-controller";
import { useParams } from "next/navigation";

interface Props {
    sak: SaksStatusResponse;
}

const SakPanel = ({ sak }: Props): React.JSX.Element => {
    const { id: fiksDigisosId } = useParams<{ id: string }>();
    const { data: klager } = useHentKlagerSuspense(fiksDigisosId);
    const sortedVedtak = sak.vedtak.toSorted((a, b) => {
        const dateA = a.dato ? new Date(a.dato).getTime() : 0;
        const dateB = b.dato ? new Date(b.dato).getTime() : 0;
        return dateB - dateA;
    });
    const latestVedtak = sortedVedtak[0];
    const allVedtakIds = sak.vedtak.map((vedtak) => vedtak.id);
    const innsendtKlage = klager.find((klage) => allVedtakIds.includes(klage.vedtakId));
    return (
        <BoxNew borderWidth="1" borderColor="neutral-subtle" borderRadius="xlarge" overflow="hidden">
            <VStack gap="space-16" padding={{ xs: "space-16", md: "space-24" }}>
                <Sakstittel tittel={sak.tittel} latestVedtakUtfall={latestVedtak?.utfall} />
                {latestVedtak && <Vedtak sortedVedtak={sak.vedtak} latestVedtak={latestVedtak} />}
            </VStack>
            {latestVedtak && (
                <BoxNew
                    padding={{ xs: "space-20", md: "space-24" }}
                    borderWidth="1 0 0 0"
                    borderColor="neutral-subtle"
                    background="neutral-soft"
                >
                    <KlageInfo innsendtKlage={innsendtKlage} vedtakId={latestVedtak.id} />
                </BoxNew>
            )}
        </BoxNew>
    );
};

export default SakPanel;
