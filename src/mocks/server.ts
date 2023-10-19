import {setupServer} from "msw/node";
import {getHendelseControllerMSW} from "../../generated/hendelse-controller/hendelse-controller.msw";
import {getKommuneControllerMSW} from "../../generated/kommune-controller/kommune-controller.msw";
import {getInfoControllerMSW} from "../../generated/info-controller/info-controller.msw";
import {getOppgaveControllerMSW} from "../../generated/oppgave-controller/oppgave-controller.msw";
import {getTilgangControllerMSW} from "../../generated/tilgang-controller/tilgang-controller.msw";
import {getDigisosApiTestControllerMSW} from "../../generated/digisos-api-test-controller/digisos-api-test-controller.msw";
import {getForelopigSvarControllerMSW} from "../../generated/forelopig-svar-controller/forelopig-svar-controller.msw";
import {getSaksOversiktControllerMSW} from "../../generated/saks-oversikt-controller/saks-oversikt-controller.msw";
import {getSaksStatusControllerMSW} from "../../generated/saks-status-controller/saks-status-controller.msw";
import {getSoknadMedInnsynControllerMSW} from "../../generated/soknad-med-innsyn-controller/soknad-med-innsyn-controller.msw";
import {getSoknadsStatusControllerMSW} from "../../generated/soknads-status-controller/soknads-status-controller.msw";
import {getUtbetalingerControllerMSW} from "../../generated/utbetalinger-controller/utbetalinger-controller.msw";
import {getVedleggControllerMSW} from "../../generated/vedlegg-controller/vedlegg-controller.msw";
import {rest} from "msw";

export const server = setupServer(
    ...getHendelseControllerMSW(),
    ...getInfoControllerMSW(),
    ...getKommuneControllerMSW(),
    ...getOppgaveControllerMSW(),
    ...getTilgangControllerMSW(),
    ...getDigisosApiTestControllerMSW(),
    ...getForelopigSvarControllerMSW(),
    ...getSaksOversiktControllerMSW(),
    ...getSaksStatusControllerMSW(),
    ...getSoknadMedInnsynControllerMSW(),
    ...getSoknadsStatusControllerMSW(),
    ...getUtbetalingerControllerMSW(),
    ...getVedleggControllerMSW(),
    rest.post("https://amplitude.nav.no/collect-auto", async (req, res, ctx) => {
        await ctx.fetch(req);
        return res(ctx.status(200));
    })
);
