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

const SakPanel = ({ sak, innsendtKlage }: Props): React.JSX.Element => (
    <BoxNew borderWidth="1" borderColor="neutral-subtle" borderRadius="xlarge" overflow="hidden">
        <VStack gap="space-16" padding={{ xs: "space-16", md: "space-24" }}>
            <Sakstittel fontSize="small" tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} />
            <Vedtak vedtakUtfall={sak.utfallVedtak} vedtaksliste={sak.vedtaksfilUrlList} tittel={sak.tittel} />
        </VStack>
        {sak?.utfallVedtak && (
            <BoxNew
                padding={{ xs: "space-20", md: "space-24" }}
                borderWidth="1 0 0 0"
                borderColor="neutral-subtle"
                background="neutral-soft"
            >
                <KlageInfo vedtaksliste={sak.vedtaksfilUrlList} innsendtKlage={innsendtKlage} />
            </BoxNew>
        )}
    </BoxNew>
);

export default SakPanel;
