import { Heading, HStack } from "@navikt/ds-react";
import { SaksStatusResponseStatus, VedtakDtoUtfall } from "@generated/model";

import StatusTag from "./StatusTag";

interface Props {
    tittel: string;
    latestVedtakUtfall?: VedtakDtoUtfall;
    status?: SaksStatusResponseStatus;
}

const Sakstittel = ({ tittel, latestVedtakUtfall, status }: Props) => (
    <HStack gap="space-8" align="center">
        <Heading size="small" level="3">
            {tittel}
        </Heading>
        <StatusTag vedtakUtfall={latestVedtakUtfall} className="self-start" status={status} />
    </HStack>
);

export default Sakstittel;
