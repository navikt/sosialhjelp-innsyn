import { setupServer } from "msw/node";

import { getHendelseControllerMock } from "@generated/hendelse-controller/hendelse-controller.msw";
import { getTilgangControllerMock } from "@generated/tilgang-controller/tilgang-controller.msw";
import { getDigisosApiTestControllerMock } from "@generated/digisos-api-test-controller/digisos-api-test-controller.msw";
import { getSaksOversiktControllerMock } from "@generated/saks-oversikt-controller/saks-oversikt-controller.msw";
import { getSaksStatusControllerMock } from "@generated/saks-status-controller/saks-status-controller.msw";
import { getSoknadsStatusControllerMock } from "@generated/soknads-status-controller/soknads-status-controller.msw";
import { getUtbetalingerController2Mock } from "@generated/utbetalinger-controller-2/utbetalinger-controller-2.msw";
import { getVedleggControllerMock } from "@generated/vedlegg-controller/vedlegg-controller.msw";

export const server = setupServer(
    ...getHendelseControllerMock(),
    ...getTilgangControllerMock(),
    ...getDigisosApiTestControllerMock(),
    ...getSaksOversiktControllerMock(),
    ...getSaksStatusControllerMock(),
    ...getSoknadsStatusControllerMock(),
    ...getUtbetalingerController2Mock(),
    ...getVedleggControllerMock()
);
