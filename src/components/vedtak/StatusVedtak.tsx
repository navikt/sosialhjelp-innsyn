import { Heading, VStack, Box } from "@navikt/ds-react";
import { FilePdfIcon, BankNoteIcon } from "@navikt/aksel-icons";

import { hentSaksStatuser } from "../../generated/ssr/saks-status-controller/saks-status-controller";
import StatusCard from "../soknaderList/statusCard/StatusCard";
import StatusIcon from "../soknaderList/list/soknadCard/icon/StatusIcon";

interface Props {
    id: string;
}

export const StatusVedtak = async ({ id }: Props) => {
    const saker = await hentSaksStatuser(id);

    return (
        <VStack gap="20" className="mt-20">
            {saker.map((sak, id) => (
                <div key={id}>
                    <Heading size="xlarge" level="1">
                        {sak.tittel}
                    </Heading>
                    <Box background="surface-warning-moderate">{sak.utfallVedtak ? sak.utfallVedtak : sak.status}</Box>
                    <StatusCard href="/soknad" icon={<StatusIcon icon={FilePdfIcon} />}>
                        last ned vedtaksbrev
                    </StatusCard>
                    <StatusCard href="/utbetaling" icon={<StatusIcon icon={BankNoteIcon} />}>
                        utbetaling
                    </StatusCard>
                </div>
            ))}
        </VStack>
    );
};
