import { Heading, HStack } from "@navikt/ds-react";
import { VedtakDtoUtfall } from "@generated/model";

import StatusTag from "./StatusTag";

interface Props {
    tittel: string;
    latestVedtakUtfall?: VedtakDtoUtfall;
    fontSize?: "large" | "small" | "xlarge" | "medium" | "xsmall";
}

const Sakstittel = ({ tittel, latestVedtakUtfall, fontSize = "large" }: Props) => (
    <HStack gap="space-8" align="center">
        <Heading size={fontSize} level="3">
            {tittel}
        </Heading>
        <StatusTag vedtakUtfall={latestVedtakUtfall} className="self-start" />
    </HStack>
);

export default Sakstittel;
