import { evaluateFlags, IToggle } from "@unleash/nextjs";
import { logger as pinoLogger } from "@navikt/next-logger";
import { cookies } from "next/headers";
import { connection } from "next/server";

import { isLocalhost, isMock } from "@utils/restUtils";
import { getServerEnv } from "@config/env";
import { getAndValidateDefinitions } from "@featuretoggles/definitions";

import { EXPECTED_TOGGLES, ExpectedToggles } from "./toggles";
import { localDevelopmentToggles } from "./utils";

export const UNLEASH_COOKIE_NAME = "unleash-session-id";

export const unleashLogger = pinoLogger.child({}, { msgPrefix: "[UNLEASH-TOGGLES] " });

const unleashEnvironment = process.env.NEXT_PUBLIC_RUNTIME_ENV === "prod" ? "production" : "development";

/*
 * Toggles kan overstyres med cookies lokalt og i mock. Eksempel:
 * sosialhjelp.innsyn.ny_utbetalinger_side: false
 */
const overrideTogglesWithCookies = async (toggles: IToggle[]) => {
    const cookieStore = await cookies();
    return toggles.map((toggle) => {
        const cookieValue = cookieStore.get(toggle.name)?.value;
        if (cookieValue === "true") {
            return { ...toggle, enabled: true };
        } else if (cookieValue === "false") {
            return { ...toggle, enabled: false };
        } else {
            return { ...toggle, enabled: toggle.enabled };
        }
    });
};

export async function getToggles(): Promise<IToggle[]> {
    await connection();

    if ((EXPECTED_TOGGLES as readonly string[]).length === 0) {
        unleashLogger.info("Currently no expected toggles defined, not fetching toggles from unleash");
        return [];
    }
    if (isLocalhost() || isMock()) {
        unleashLogger.info(
            `Running in local or demo mode, falling back to development toggles, current toggles: \n${localDevelopmentToggles()
                .map((it) => `\t${it.name}: ${it.enabled}`)
                .join("\n")}`
        );

        return overrideTogglesWithCookies(localDevelopmentToggles());
    } else if (getServerEnv().NEXT_PUBLIC_RUNTIME_ENVIRONMENT === "e2e") {
        unleashLogger.warn("Running in e2e mode");
        return EXPECTED_TOGGLES.map((it) => ({
            name: it,
            enabled: it === "sosialhjelp.innsyn.ny_landingsside",
            impressionData: false,
            variant: {
                name: "disabled",
                enabled: false,
            },
        }));
    }

    try {
        const sessionId = await getUnleashSessionId();
        const definitions = await getAndValidateDefinitions();
        const evaluatedFlags = evaluateFlags(definitions, {
            sessionId,
            environment: unleashEnvironment,
            appName: `sosialhjelp-innsyn-${process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT}`,
        });
        return evaluatedFlags.toggles;
    } catch (e) {
        unleashLogger.error(
            new Error("Failed to get flags from Unleash. Falling back to default flags.", { cause: e })
        );
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

async function getUnleashSessionId(): Promise<string> {
    const existingUnleashId = (await cookies()).get(UNLEASH_COOKIE_NAME);
    if (existingUnleashId != null) {
        return existingUnleashId.value;
    } else {
        unleashLogger.info("No existing unleash session id found, is middleware not configured?");
        return "0";
    }
}
