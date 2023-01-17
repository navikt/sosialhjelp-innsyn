import {setupServer} from "msw/node";

import {getHendelseControllerMSW} from "../generated/hendelse-controller/hendelse-controller.msw";
import {getKommuneControllerMSW} from "../generated/kommune-controller/kommune-controller.msw";

const handlers = [...getKommuneControllerMSW(), ...getHendelseControllerMSW()];
export const server = setupServer(...handlers);
