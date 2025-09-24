"use client";

import { VStack } from "@navikt/ds-react";

import { useHentSakForVedtak } from "@generated/sak-controller/sak-controller";

import KlageVedtakHeader from "./KlageVedtakHeader";
import KlageVedtakContainer from "./KlageVedtakContainer";

interface Props {
    fiksDigisosId: string;
    vedtakId: string;
}

const KlageVedtak = ({ fiksDigisosId, vedtakId }: Props) => {
    const { data: sak } = useHentSakForVedtak(fiksDigisosId, vedtakId);

    if (!sak) return null;

    return (
        <VStack>
            <KlageVedtakHeader tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} />
            <KlageVedtakContainer vedtakUtfall={sak.utfallVedtak!} vedtaksliste={sak.vedtaksfilUrlList} />
        </VStack>
    );
};

export default KlageVedtak;
