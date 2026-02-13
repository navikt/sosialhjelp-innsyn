/*
TODO: Aksel Box migration:
Could not migrate the following:
  - background=warning-moderateA
*/

import { BodyShort, Box, Heading } from "@navikt/ds-react";
import { VilkarResponse } from "@generated/model";

interface Props {
    vilkar: VilkarResponse;
}

const Vilkar = ({ vilkar }: Props) => (
    <Box background="warning-moderateA" padding="space-24" borderRadius="12">
        <Heading level="4" size="small" lang="no">
            {vilkar.tittel}
        </Heading>
        <BodyShort lang="no">{vilkar.beskrivelse}</BodyShort>
    </Box>
);

export default Vilkar;
