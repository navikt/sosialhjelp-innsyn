import { BodyShort, Box, Heading } from "@navikt/ds-react";

import { VilkarResponse } from "@generated/model";

interface Props {
    vilkar: VilkarResponse;
}

const Vilkar = ({ vilkar }: Props) => (
    <Box.New background="warning-moderateA" padding="space-24" borderRadius="xlarge">
        <Heading level="4" size="small" lang="no">
            {vilkar.tittel}
        </Heading>
        <BodyShort lang="no">{vilkar.beskrivelse}</BodyShort>
    </Box.New>
);

export default Vilkar;
