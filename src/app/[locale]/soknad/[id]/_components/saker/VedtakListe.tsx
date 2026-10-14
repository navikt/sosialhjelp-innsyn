import { KlageRef, VedtakDto } from "@generated/model";

import ExpandableList from "@components/showmore/ExpandableList";
import VedtakPanel from "./VedtakPanel";

interface Props {
    vedtak: VedtakDto[];
    klager?: KlageRef[];
    id: string;
    labelledById: string;
    showMoreSuffix: string;
}

const VedtakListe = ({ vedtak, klager, id, labelledById, showMoreSuffix }: Props) => {
    if (!vedtak.length) {
        return null;
    }

    return (
        <ExpandableList
            as="ol"
            items={vedtak}
            itemsLimit={1}
            id={id}
            labelledById={labelledById}
            showMoreSuffix={showMoreSuffix}
            gap="space-16"
        >
            {(enkeltvedtak, ref) => (
                <li key={enkeltvedtak.id} ref={ref} tabIndex={-1}>
                    <VedtakPanel
                        vedtak={enkeltvedtak}
                        innsendtKlage={klager?.find((klage) => klage.vedtakId === enkeltvedtak.id)}
                    />
                </li>
            )}
        </ExpandableList>
    );
};

export default VedtakListe;
