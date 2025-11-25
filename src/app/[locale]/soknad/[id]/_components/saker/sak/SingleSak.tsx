import React from "react";
import { HStack } from "@navikt/ds-react";

import { KlageRef, SaksStatusResponse } from "@generated/model";

import Vedtak from "../vedtak/Vedtak";

import Sakstittel from "./Sakstittel";

interface Props {
    sak: SaksStatusResponse;
    innsendtKlage?: KlageRef;
}

const SingleSak = ({ sak, innsendtKlage }: Props): React.JSX.Element | null => {
    if (!sak.utfallVedtak) {
        return null;
    }
    return (
        <HStack gap="4">
            <Sakstittel fontSize="small" tittel={sak.tittel} vedtakUtfall={sak.utfallVedtak} />
            <Vedtak
                vedtakUtfall={sak.utfallVedtak}
                vedtaksliste={sak.vedtaksfilUrlList}
                innsendtKlage={innsendtKlage}
            />
        </HStack>
    );
};

export default SingleSak;
