import React from "react";
import Vedtak from "./Vedtak";
import { BoxNew } from "@navikt/ds-react";
import KlageInfo from "./KlageInfo";
import { KlageRef, SaksStatusResponse } from "@generated/model";
import Sakstittel from "../Sakstittel";

interface Props {
    sak: SaksStatusResponse;
    innsendtKlage?: KlageRef;
}

const SakPanel = ({ sak, innsendtKlage }: Props): React.JSX.Element => (
    <BoxNew borderWidth="1" borderColor="neutral-subtle" borderRadius="xlarge" overflow="hidden">
        <BoxNew padding="8">
            <Sakstittel fontSize="small" tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} />
            <Vedtak vedtakUtfall={sak.utfallVedtak} vedtaksliste={sak.vedtaksfilUrlList} tittel={sak.tittel} />
        </BoxNew>
        {sak?.utfallVedtak && (
            <BoxNew padding="8" borderWidth="1 0 0 0" borderColor="neutral-subtle" background="neutral-soft">
                <KlageInfo vedtaksliste={sak.vedtaksfilUrlList} innsendtKlage={innsendtKlage} />
            </BoxNew>
        )}
    </BoxNew>
);

export default SakPanel;
