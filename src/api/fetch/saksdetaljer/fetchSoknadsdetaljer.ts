import * as R from "remeda";

import { SaksListeResponse } from "../../../generated/model";
import {
    getSaksDetaljer,
    getSaksDetaljerResponse,
} from "../../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";

const fetchSoknadsdetaljer = (saker: SaksListeResponse[]): Promise<getSaksDetaljerResponse>[] =>
    // TODO: Filteret her tror jeg ikke trengs, da fiksDigisosId alltid skal være satt. Se TODO i innsyn-api.
    R.pipe(
        saker,
        R.filter((sak) => !!sak.fiksDigisosId),
        R.map((sak) => getSaksDetaljer(sak.fiksDigisosId!))
    );

export default fetchSoknadsdetaljer;
