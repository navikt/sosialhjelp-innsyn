import { VStack } from "@navikt/ds-react";
import { KlageRef, SaksStatusResponse } from "@generated/model";

import Vedtak from "../vedtak/Vedtak";

import Sakstittel from "./Sakstittel";

interface Props {
    sak: SaksStatusResponse;
    innsendtKlage?: KlageRef;
}

const Sak = ({ sak, innsendtKlage }: Props) => {
    const sortedVedtaksliste =
        sak.vedtak?.toSorted((a, b) => {
            const dateA = a.dato ? new Date(a.dato).getTime() : 0;
            const dateB = b.dato ? new Date(b.dato).getTime() : 0;
            return dateB - dateA; // Descending order (newest first)
        }) ?? [];
    return (
        <VStack gap="4">
            <Sakstittel fontSize="small" tittel={sak.tittel} latestVedtakUtfall={sortedVedtaksliste[0].utfall} />
            {sak.utfallVedtak && <Vedtak vedtak={sak.vedtak} innsendtKlage={innsendtKlage} />}
        </VStack>
    );
};

export default Sak;
