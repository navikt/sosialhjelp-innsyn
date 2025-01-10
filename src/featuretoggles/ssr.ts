// TODO: Ta bort denne når vi får unleash til å funke igjen
/* eslint-disable @typescript-eslint/no-unused-vars */

import {getRandomValues} from "crypto";

import {IToggle, getDefinitions, evaluateFlags} from "@unleash/nextjs";
import {logger} from "@navikt/next-logger";
import {GetServerSidePropsContext} from "next/types";
import * as R from "remeda";

import {isLocalhost} from "../utils/restUtils";

import {getUnleashEnvironment, localDevelopmentToggles} from "./utils";
import {EXPECTED_TOGGLES} from "./toggles";

export async function getFlagsServerSide(
    req: GetServerSidePropsContext["req"],
    res: GetServerSidePropsContext["res"]
): Promise<{toggles: IToggle[]}> {
    if (isLocalhost()) {
        logger.warn("Running in local or demo mode, falling back to development toggles.");
        return {toggles: localDevelopmentToggles()};
    }

    // TODO: Returnerer default toggles, siden vi ikke får kontakt med unleash i prod-gcp. Finn ut hvorfor!
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

    // try {
    //     const sessionId = req.cookies["unleash-session-id"] || `${getRandomValues(new Uint32Array(2)).join("")}`;
    //     res.setHeader("set-cookie", `unleash-session-id=${sessionId}; path=/;`);
    //     const definitions = await getAndValidateDefinitions();
    //     return evaluateFlags(definitions, {
    //         sessionId,
    //         environment: getUnleashEnvironment(),
    //         // Brukes for a skille på mock/q0/dev/osv
    //         appName: `sosialhjelp-innsyn-${process.env.NEXT_PUBLIC_RUNTIME_ENVIRONMENT}`,
    //     });
    // } catch (e) {
    //     logger.error(new Error("Failed to get flags from Unleash. Falling back to default flags.", {cause: e}));
    //     return {
    //         toggles: EXPECTED_TOGGLES.map(
    //             (it): IToggle => ({
    //                 name: it,
    //                 variant: {
    //                     name: "default",
    //                     enabled: false,
    //                 },
    //                 impressionData: false,
    //                 enabled: false,
    //             })
    //         ),
    //     };
    // }
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
