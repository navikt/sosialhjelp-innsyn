import {setupServer} from "msw/node";
import {getHendelseControllerMock} from "../generated/hendelse-controller/hendelse-controller.msw";
import {getKommuneControllerMock} from "../generated/kommune-controller/kommune-controller.msw";
import {getInfoControllerMock} from "../generated/info-controller/info-controller.msw";
import {getOppgaveControllerMock} from "../generated/oppgave-controller/oppgave-controller.msw";
import {getTilgangControllerMock} from "../generated/tilgang-controller/tilgang-controller.msw";
import {getDigisosApiTestControllerMock} from "../generated/digisos-api-test-controller/digisos-api-test-controller.msw";
import {getForelopigSvarControllerMock} from "../generated/forelopig-svar-controller/forelopig-svar-controller.msw";
import {getSaksOversiktControllerMock} from "../generated/saks-oversikt-controller/saks-oversikt-controller.msw";
import {getSaksStatusControllerMock} from "../generated/saks-status-controller/saks-status-controller.msw";
import {getSoknadMedInnsynControllerMock} from "../generated/soknad-med-innsyn-controller/soknad-med-innsyn-controller.msw";
import {getSoknadsStatusControllerMock} from "../generated/soknads-status-controller/soknads-status-controller.msw";
import {getUtbetalingerControllerMock} from "../generated/utbetalinger-controller/utbetalinger-controller.msw";
import {getVedleggControllerMock} from "../generated/vedlegg-controller/vedlegg-controller.msw";
import {http} from "msw";

export const server = setupServer(
    ...getHendelseControllerMock(),
    ...getInfoControllerMock(),
    ...getKommuneControllerMock(),
    ...getOppgaveControllerMock(),
    ...getTilgangControllerMock(),
    ...getDigisosApiTestControllerMock(),
    ...getForelopigSvarControllerMock(),
    ...getSaksOversiktControllerMock(),
    ...getSaksStatusControllerMock(),
    ...getSoknadMedInnsynControllerMock(),
    ...getSoknadsStatusControllerMock(),
    ...getUtbetalingerControllerMock(),
    ...getVedleggControllerMock(),
    http.post("https://amplitude.nav.no/collect-auto", async (info) => {
        return new Response(null, {status: 200});
    })
);
