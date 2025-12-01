import * as R from "remeda";

import { SaksListeResponse } from "@generated/model";
import { getSaksDetaljer } from "@generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import { SaksDetaljerResponse } from "@generated/ssr/model";

const fetchSoknadsdetaljer = (saker: SaksListeResponse[]): Promise<SaksDetaljerResponse>[] =>
    R.pipe(
        saker,
        R.map((sak) => getSaksDetaljer(sak.fiksDigisosId))
    );

export default fetchSoknadsdetaljer;
