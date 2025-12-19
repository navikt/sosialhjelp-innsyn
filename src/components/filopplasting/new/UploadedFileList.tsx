import React, { ReactNode } from "react";
import { Link, List, Skeleton } from "@navikt/ds-react";
import { ListItem } from "@navikt/ds-react/List";
import { LinkIcon } from "@navikt/aksel-icons";
import { useGetVedleggForOppgave } from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";

interface Props {
    fiksDigisosId: string;
    oppgaveId?: string;
}

const UploadedFileList = ({ fiksDigisosId, oppgaveId }: Props): ReactNode | null => {
    const { data, isLoading, isError } = useGetVedleggForOppgave(fiksDigisosId, oppgaveId!, {
        query: { enabled: !!fiksDigisosId && !!oppgaveId },
    });

    if (isLoading) {
        return (
            <List>
                <ListItem icon={<LinkIcon />}>
                    <Skeleton width="80px" />
                </ListItem>
            </List>
        );
    }
    if (isError || !data || data.length === 0) {
        return null;
    }

    return (
        <List>
            {data.map((item) => (
                <ListItem key={item.url} icon={<LinkIcon />}>
                    <Link href={item.url}>{item.filnavn}</Link>
                </ListItem>
            ))}
        </List>
    );
};

export default UploadedFileList;
