import { evaluateFlags, getDefinitions, IToggle } from "@unleash/nextjs";
import { logger as pinoLogger } from "@navikt/next-logger";
import * as R from "remeda";
import { NextApiRequestCookies } from "next/dist/server/api-utils";

import { isLocalhost, isMock } from "../../utils/restUtils";
import { EXPECTED_TOGGLES, ExpectedToggles } from "../toggles";
import { localDevelopmentToggles } from "../utils";

export const UNLEASH_COOKIE_NAME = "unleash-session-id";

const logger = pinoLogger.child({}, { msgPrefix: "[UNLEASH-TOGGLES-DEPRECATED-PAGES] " });

const unleashEnvironment = process.env.NEXT_PUBLIC_RUNTIME_ENV === "prod" ? "production" : "development";

export async function getToggles(cookies: NextApiRequestCookies): Promise<IToggle[]> {
    if ((EXPECTED_TOGGLES as readonly string[]).length === 0) {
        logger.info("Currently no expected toggles defined, not fetching toggles from unleash");
        return [];
    }
    const cookieStore = cookies;

    if (isLocalhost() || isMock()) {
        logger.warn(
            `Running in local or demo mode, falling back to development toggles, current toggles: \n${localDevelopmentToggles()
                .map((it) => `\t${it.name}: ${it.enabled}`)
                .join("\n")}`
        );

        return localDevelopmentToggles().map((it) => ({
            ...it,
            enabled: cookieStore[it.name]?.includes("true") ?? it.enabled,
        }));
    }

    try {
        const sessionId = await getUnleashSessionId(cookies);
        const definitions = await getAndValidateDefinitions();
        const evaluatedFlags = evaluateFlags(definitions, {
            sessionId,
            environment: unleashEnvironment,
            appName: `sosialhjelp-innsyn-${process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT}`,
        });
        return evaluatedFlags.toggles;
    } catch (e) {
        logger.error(new Error("Failed to get flags from Unleash. Falling back to default flags.", { cause: e }));
        return EXPECTED_TOGGLES.map(
            (it): IToggle => ({
                name: it,
                variant: {
                    name: "default",
                    // Default to on if failed
                    enabled: true,
                },
                impressionData: false,
                enabled: false,
            })
        );
    }
}

export function getFlag(flag: ExpectedToggles, toggles: IToggle[]): IToggle {
    const toggle = toggles.find((it) => it.name === flag);

    if (toggle == null) {
        return { name: flag, enabled: false, impressionData: false, variant: { name: "disabled", enabled: false } };
    }

    return toggle;
}

async function getAndValidateDefinitions(): Promise<Awaited<ReturnType<typeof getDefinitions>>> {
    const url = process.env.UNLEASH_SERVER_API_URL;
    if (!url) {
        throw new Error("Missing UNLEASH_SERVER_API_URL");
    }
    const definitions = await getDefinitions({
        appName: "sosialhjelp-innsyn",
        url: `${url}/api/client/features`,
    });
    if ("message" in definitions) {
        throw new Error(`Toggle was 200 OK, but server said: ${definitions.message}`);
    }

    const diff = R.difference(
        EXPECTED_TOGGLES,
        R.map(definitions.features, (it) => it.name)
    );

    if (diff.length > 0) {
        logger.error(
            `Difference in expected flags and flags in unleash, expected but not in unleash: ${diff.join(", ")}`
        );
    } else {
        logger.info(
            `Fetched ${definitions.features.length} flags from unleash, found all ${EXPECTED_TOGGLES.length} expected flags`
        );
    }

    return definitions;
}

async function getUnleashSessionId(cookies: NextApiRequestCookies): Promise<string> {
    const existingUnleashId = cookies[UNLEASH_COOKIE_NAME];
    if (existingUnleashId != null) {
        return existingUnleashId;
    } else {
        logger.warn("No existing unleash session id found, is middleware not configured?");
        return "0";
    }
}
