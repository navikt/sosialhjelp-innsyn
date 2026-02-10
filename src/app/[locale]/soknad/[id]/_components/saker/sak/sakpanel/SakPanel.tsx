import React from "react";
import Vedtak from "./Vedtak";
import { BoxNew, VStack } from "@navikt/ds-react";
import KlageInfo from "./KlageInfo";
import { KlageRef, SaksStatusResponse } from "@generated/model";
import Sakstittel from "../Sakstittel";

interface Props {
    sak: SaksStatusResponse;
    innsendtKlage?: KlageRef;
}

const SakPanel = ({ sak, innsendtKlage }: Props): React.JSX.Element => {
    const sortedVedtak = sak.vedtak.toSorted((a, b) => {
        const dateA = a.dato ? new Date(a.dato).getTime() : 0;
        const dateB = b.dato ? new Date(b.dato).getTime() : 0;
        return dateB - dateA;
    });
    const latestVedtak = sortedVedtak[0];
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
                    <KlageInfo latestVedtak={latestVedtak} innsendtKlage={innsendtKlage} />
                </BoxNew>
            )}
        </BoxNew>
    );
};

export default SakPanel;
