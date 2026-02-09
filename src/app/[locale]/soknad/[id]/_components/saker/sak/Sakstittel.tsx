import { Heading, HStack } from "@navikt/ds-react";
import { VedtakDtoUtfall } from "@generated/model";

import StatusTag from "./StatusTag";

interface Props {
    tittel: string;
    latestVedtakUtfall?: VedtakDtoUtfall;
}

const Sakstittel = ({ tittel, latestVedtakUtfall }: Props) => (
    <HStack gap="space-8" align="center">
        <Heading size="small" level="3">
            {tittel}
        </Heading>
        <StatusTag vedtakUtfall={latestVedtakUtfall} className="self-start" />
    </HStack>
);

export default Sakstittel;
