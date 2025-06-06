import { Heading } from "@navikt/ds-react";

import StatusCard from "../../statusCard/StatusCard";
import { SaksDetaljerResponse } from "../../../../generated/ssr/model";
import StatusIcon from "./icon/StatusIcon";
import SoknadCardDescription from "./description/SoknadCardDescription";

interface Props {
    sak: SaksDetaljerResponse;
}

const SoknadCard = async ({ sak }: Props) => {
    return (
        <StatusCard href={`/soknader/${sak.fiksDigisosId}`} description={<SoknadCardDescription />}>
            <StatusIcon status={sak.status} />
            <Heading size="small" level="3" lang="nb">
                {sak.soknadTittel.length ? sak.soknadTittel : "Søknad om økonomisk sosialhjelp"}
            </Heading>
        </StatusCard>
    );
};

export default SoknadCard;
