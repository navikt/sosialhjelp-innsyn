"use server";
import { getRandomValues } from "crypto";

import { IToggle, getDefinitions, evaluateFlags, flagsClient } from "@unleash/nextjs";
import { logger } from "@navikt/next-logger";
import * as R from "remeda";
import { cookies } from "next/headers";

import { isLocalhost } from "../../utils/restUtils";
import { getUnleashEnvironment, localDevelopmentToggles } from "../../featuretoggles/utils";
import { EXPECTED_TOGGLES } from "../../featuretoggles/toggles";

export async function getFlagsServerSide() {
    if (isLocalhost()) {
        logger.warn("Running in local or demo mode, falling back to development toggles.");
        return { toggles: localDevelopmentToggles() };
    }

    const cookieStore = await cookies();

    try {
        const sessionId =
            cookieStore.get("unleash-session-id")?.value || `${getRandomValues(new Uint32Array(2)).join("")}`;
        cookieStore.set("unleash-session-id", sessionId, { path: "/" });
        const definitions = await getAndValidateDefinitions();
        return evaluateFlags(definitions, {
            sessionId,
            environment: getUnleashEnvironment(),
            // Brukes for a skille på mock/q0/dev/osv
            appName: `sosialhjelp-innsyn-${process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT}`,
        });
    } catch (e) {
        logger.error(new Error("Failed to get flags from Unleash. Falling back to default flags.", { cause: e }));
        return {
            toggles: EXPECTED_TOGGLES.map(
                (it): IToggle => ({
                    name: it,
                    variant: {
                        name: "default",
                        enabled: false,
                    },
                    impressionData: false,
                    enabled: false,
                })
            ),
        };
    }
}

export async function getFlagServerSide(flagName: string) {
    const { toggles } = await getFlagsServerSide();
    const flags = flagsClient(toggles);

    return flags.isEnabled(flagName);
}

/**
 * If there are any toggles defined in EXPECTED_TOGGLES that are not returned by Unleash, something is out of sync.
 */
async function getAndValidateDefinitions(): Promise<ReturnType<typeof getDefinitions>> {
    logger.info("Fetching flags from unleash on url: " + process.env.UNLEASH_SERVER_API_URL + "/api");
    const definitions = await getDefinitions({
        appName: "sosialhjelp-innsyn-unleash-api-token-prod-gcp",
        url: process.env.UNLEASH_SERVER_API_URL + "/api",
    });

    if (!definitions?.features?.length) {
        logger.error("Couldn't fetch toggles or no toggles. definitions: " + JSON.stringify(definitions));
    }

    const diff = R.difference(
        EXPECTED_TOGGLES,
        R.map(definitions.features, (it) => it.name)
    );

    if (diff.length > 0) {
        logger.error(
            `Difference in expected flags and flags in unleash, expected but not in unleash: ${diff.join(", ")}`
        );
    }

    logger.info(
        `Fetched ${definitions.features.length} flags from unleash: ${definitions.features
            .map((it) => it.name)
            .join("\n")}\n`
    );

    return definitions;
}
