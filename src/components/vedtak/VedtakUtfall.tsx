import { Box, Heading, Tag, VStack } from "@navikt/ds-react";
import { FilePdfIcon } from "@navikt/aksel-icons";

import { SaksStatusResponseUtfallVedtak } from "../../generated/ssr/model";
import StatusCard from "../soknaderList/statusCard/StatusCard";
import StatusIcon from "../soknaderList/list/soknadCard/icon/StatusIcon";

interface Props {
    tittel: string;
    beskrivelse: string;
    utfallVedtak?: SaksStatusResponseUtfallVedtak;
}

export const VedtakUtfall = async ({ tittel, beskrivelse, utfallVedtak }: Props) => {
    const boxColor = (utfallVedtak?: SaksStatusResponseUtfallVedtak) => {
        if (utfallVedtak === "INNVILGET") {
            return "surface-success-subtle";
        }
        if (utfallVedtak === "DELVIS_INNVILGET") {
            return "surface-warning-subtle";
        }
        if (utfallVedtak === "AVVIST") {
            return "surface-danger-subtle";
        }
        if (utfallVedtak === "AVSLATT") {
            return "surface-danger-subtle";
        }
    };

    return (
        <VStack>
            <Heading size="xlarge" level="1">
                {tittel}
            </Heading>
            <Tag variant="info">Status: {utfallVedtak}</Tag>
            <StatusCard href="/soknad" icon={<StatusIcon icon={FilePdfIcon} />}>
                Last ned vedtaksbrev
            </StatusCard>
            <Box background={boxColor(utfallVedtak)} className="rounded p-4">
                {beskrivelse}
            </Box>
        </VStack>
    );
};
