import { getDefinitions } from "@unleash/nextjs";
import * as R from "remeda";
import QuickLRU from "quick-lru";

import { unleashLogger } from "@featuretoggles/unleash";
import { EXPECTED_TOGGLES } from "@featuretoggles/toggles";

type ToggleDefinitions = Awaited<ReturnType<typeof getDefinitions>>;

const TOGGLES_KEY = "toggles";

const unleashCache = new QuickLRU<typeof TOGGLES_KEY, ToggleDefinitions>({
    maxAge: 15 * 1000,
    maxSize: 10,
});

let previousValid: ToggleDefinitions | null;

/**
 * Fetches the definitions from Unleash and caches them in a simple in-memory cache with 15 seconds TTL.
 *
 * Validates their presence against the expected toggles.
 */
export async function getAndValidateDefinitions(): Promise<ToggleDefinitions> {
    if (unleashCache.has(TOGGLES_KEY)) {
        const cachedToggles = unleashCache.get(TOGGLES_KEY);
        if (cachedToggles != null) {
            unleashLogger.debug("Using cached toggles from Unleash");
            return cachedToggles;
        }
    }

    try {
        unleashLogger.debug("No cached toggles found, fetching from Unleash");
        const definitions = await fetchDefinitions();

        unleashCache.set(TOGGLES_KEY, definitions);
        previousValid = definitions;

        diffToggles(definitions);

        return definitions;
    } catch (e: unknown) {
        unleashLogger.error(e, "Failed to fetch toggle definitions from Unleash");
        if (previousValid != null) {
            return previousValid;
        }
        throw new Error("Failed to fetch toggles from Unleash, and no previous valid toggles available", {
            cause: e,
        });
    }
}

async function fetchDefinitions(): Promise<ToggleDefinitions> {
    const url = process.env.UNLEASH_SERVER_API_URL;
    if (!url) {
        throw new Error("Missing UNLEASH_SERVER_API_URL");
    }
    const definitions = getDefinitions({
        appName: "sosialhjelp-innsyn",
        url: `${url}/api/client/features`,
    });

    if ("message" in definitions) {
        throw new Error(`Toggle was 200 OK, but server said: ${definitions.message}`);
    }

    return definitions;
}

/**
 * Makes sure that all toggles defined in code are also present in Unleash.
 *
 * Is completely no-op when everything is up to date.
 */
function diffToggles(definitions: ToggleDefinitions): void {
    const diff = R.difference(
        EXPECTED_TOGGLES,
        R.map(definitions.features, (it) => it.name)
    );

    if (diff.length > 0) {
        unleashLogger.error(
            `Difference in expected flags and flags in unleash, expected but not in unleash: ${diff.join(", ")}`
        );
    }
}
