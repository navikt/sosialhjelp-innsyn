import { VStack } from "@navikt/ds-react";

import { KlageRef, SaksStatusResponse } from "@generated/model";

import Vedtak from "../vedtak/Vedtak";

import Sakstittel from "./Sakstittel";

interface Props {
    sak: SaksStatusResponse;
    innsendtKlage?: KlageRef;
}

const Sak = ({ sak, innsendtKlage }: Props) => {
    if (!sak.utfallVedtak) {
        return null;
    }
    return (
        <VStack gap="4">
            <Sakstittel fontSize="medium" tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} />
            <Vedtak
                vedtakUtfall={sak.utfallVedtak}
                vedtaksliste={sak.vedtaksfilUrlList}
                innsendtKlage={innsendtKlage}
            />
        </VStack>
    );
};

export default Sak;
