import { SaksListeResponse } from "../../../generated/model";
import { getSaksDetaljer } from "../../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";

import SoknadCard from "./soknadCard/SoknadCard";

interface Props {
    saker: SaksListeResponse[];
}

const fetchSaksDetaljer = async (saker: SaksListeResponse[]) =>
    // TODO: Filteret her tror jeg ikke trengs, da fiksDigisosId alltid skal være satt. Se TODO i innsyn-api.
    Promise.all(saker.filter((sak) => sak.fiksDigisosId).map((sak) => getSaksDetaljer(sak.fiksDigisosId!)));

const AktiveSoknaderList = async ({ saker }: Props) => {
    const saksDetaljer = await fetchSaksDetaljer(saker);
    console.log(saksDetaljer);
    return (
        <>
            {saksDetaljer
                .filter((sakResponse) => sakResponse.status === 200)
                .map((sak) => (
                    <SoknadCard key={sak.data.fiksDigisosId} sak={sak.data} />
                ))}
        </>
    );
};

export default AktiveSoknaderList;
